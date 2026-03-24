/**
 * build.js
 * data/articles/*.md を読み込み、data/articles.json を生成する。
 * 使い方: node scripts/build.js
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ARTICLES_DIR = path.join(__dirname, "../data/articles");
const OUTPUT_FILE = path.join(__dirname, "../data/articles.json");

/* ------------------------------------------------------------------ */
/* YAML frontmatter パーサー（外部ライブラリ不要）                        */
/* ------------------------------------------------------------------ */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("frontmatter が見つかりません");

  const yamlText = match[1];
  const body = match[2].trim();

  const data = parseYaml(yamlText);
  data.body = markdownToHtml(body);
  return data;
}

function parseYaml(text) {
  const lines = text.split(/\r?\n/);
  const result = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // トップレベルキー
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (!keyMatch) { i++; continue; }

    const key = keyMatch[1];
    const rest = keyMatch[2].trim();

    if (rest === "") {
      // 配列ブロック
      const arr = [];
      i++;
      while (i < lines.length && lines[i].match(/^\s+-/)) {
        // オブジェクト要素 ( - type: Org / value: "..." )
        if (lines[i].match(/^\s+-\s+\w+:/)) {
          const obj = {};
          const firstProp = lines[i].match(/^\s+-\s+(\w+):\s*(.*)$/);
          if (firstProp) obj[firstProp[1]] = stripQuotes(firstProp[2]);
          i++;
          while (i < lines.length && lines[i].match(/^\s{4,}\w+:/)) {
            const prop = lines[i].match(/^\s+(\w+):\s*(.*)$/);
            if (prop) obj[prop[1]] = stripQuotes(prop[2]);
            i++;
          }
          arr.push(obj);
        } else {
          // スカラー要素 ( - "value" )
          const scalarMatch = lines[i].match(/^\s+-\s*(.*)$/);
          if (scalarMatch) arr.push(stripQuotes(scalarMatch[1]));
          i++;
        }
      }
      result[key] = arr;
    } else {
      // スカラー値
      result[key] = stripQuotes(rest);
      i++;
    }
  }

  return result;
}

function stripQuotes(str) {
  str = str.trim();
  if ((str.startsWith('"') && str.endsWith('"')) ||
      (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1);
  }
  return str;
}

/* ------------------------------------------------------------------ */
/* Markdown → HTML コンバーター                                          */
/* ------------------------------------------------------------------ */
function markdownToHtml(md) {
  const lines = md.split(/\r?\n/);
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 見出し
    if (line.startsWith("### ")) {
      html.push(`<h4>${inlineToHtml(line.slice(4))}</h4>`);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      html.push(`<h3>${inlineToHtml(line.slice(3))}</h3>`);
      i++; continue;
    }

    // Markdown テーブル
    if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      html.push(buildTable(tableLines));
      continue;
    }

    // 箇条書き（- または * ）
    if (line.match(/^[-*]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        items.push(`<li>${inlineToHtml(lines[i].slice(2))}</li>`);
        i++;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // 番号付きリスト
    if (line.match(/^\d+\.\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push(`<li>${inlineToHtml(lines[i].replace(/^\d+\.\s/, ""))}</li>`);
        i++;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // 空行
    if (line.trim() === "") { i++; continue; }

    // 段落
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== "" &&
           !lines[i].startsWith("#") && !lines[i].startsWith("|") &&
           !lines[i].match(/^[-*]\s/) && !lines[i].match(/^\d+\.\s/)) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      html.push(`<p>${inlineToHtml(paraLines.join(" "))}</p>`);
    }
  }

  return html.join("");
}

function inlineToHtml(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

function buildTable(rows) {
  const parsed = rows.map((r) =>
    r.split("|").filter((_, i, a) => i > 0 && i < a.length - 1).map((c) => c.trim())
  );
  // 区切り行（---）を除外
  const dataRows = parsed.filter((r) => !r.every((c) => /^[-:]+$/.test(c)));
  if (dataRows.length === 0) return "";

  const [head, ...body] = dataRows;
  const thead = `<thead><tr>${head.map((c) => `<th>${c}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${body
    .map((r) => `<tr>${r.map((c) => `<td>${inlineToHtml(c)}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
  return `<table>${thead}${tbody}</table>`;
}

/* ------------------------------------------------------------------ */
/* メイン処理                                                             */
/* ------------------------------------------------------------------ */
function build() {
  const files = fs.readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const articles = [];
  const errors = [];

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const article = parseFrontmatter(content);
      articles.push(article);
    } catch (e) {
      errors.push(`  ${file}: ${e.message}`);
    }
  }

  if (errors.length > 0) {
    console.error("以下のファイルでエラーが発生しました:");
    errors.forEach((e) => console.error(e));
    process.exit(1);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2), "utf8");
  console.log(`✅ ${articles.length} 件の記事から articles.json を生成しました`);
}

build();
