# 記事作成コマンド

以下の手順で記事を1件作成し、`data/articles/` にMarkdownフロントマター形式で保存してください。

## 手順

1. `指示書.md` を読み、分類ルール（Taxonomy）と制約を確認する
2. `data/articles/` 内の全 `.md` ファイルを読み込み、既存記事の **タイトル・概要・ID** をすべて把握する
3. 作成しようとしている記事が既存記事と内容・テーマで重複しないか確認する。重複する場合はその旨を伝え、作成を中止する
4. カテゴリを判断し、そのカテゴリ内で最大の連番 + 1 を新しいIDとする（例: A003が最大なら A004）
5. 以下のフォーマットで記事を生成し、`data/articles/{ID}.md` として保存する

## 出力フォーマット

```markdown
---
id: "{ID}"
title: "{記事タイトル}"
summary: "{100字以内の概要文}"
category: "{A〜Fのカテゴリ記号}"
categoryName: "{カテゴリの日本語名}"
subcategory: "{A-1などのサブカテゴリ記号}"
subcategoryName: "{サブカテゴリの日本語名}"
tags:
  - type: Org
    value: "{開発主体名}"
  - type: Tech
    value: "{技術要素}"
  - type: Domain
    value: "{産業/学問}"
  - type: Topic
    value: "{社会的論点}"
  - type: Status
    value: "{年号。例: 2025年}"
links:
  - "{情報源URL 1}"
  - "{情報源URL 2}"
releaseDate: "{YYYY-MM-DD または YYYY-MM または YYYY}"
lastVerified: "{今日の日付 YYYY-MM-DD}"
---

（ここにMarkdown形式の本文を記述する。見出しは##、箇条書きは-、表はMarkdownテーブルを使用）
```

## 制約（指示書.mdのOperation Rulesより）

- タグは事実・定量ベースのみ（主観的表現禁止）
- 標準語彙を使用すること（俗称禁止）
- IDおよび記事の内容・テーマが既存と重複しないこと
- `lastVerified` は必ず今日の日付を記載すること
- `links` に記載したURLは `body` 内に重複して書かないこと

## 記事化するテーマ・情報

$ARGUMENTS
