# 記事の投稿手順

## 必要なもの

- Git
- GitHubアカウント
- AIエージェント（下記いずれか）

---

## 手順

### 1. リポジトリをクローンする

```bash
git clone https://github.com/lowpixelmildorbit/ai_database.git
cd ai_database
```

### 2. 作業ブランチを作成する

```bash
git checkout -b feat/add-{記事の内容}
```

例：
```bash
git checkout -b feat/add-openai-gpt5
```

### 3. AIエージェントのセットアップ（初回のみ）

記事作成のプロンプトは `skills/create-article.md` に定義されています。
使用するAIエージェントに合わせて、以下の手順で一度だけ設定してください。

---

#### Claude Code

`.claude/commands/` にすでに設定済みです。追加作業は不要です。

リポジトリフォルダで Claude Code を開けばそのまま使えます。

---

#### Cursor

`.cursor/rules/` フォルダを作成し、`create-article.mdc` を追加します。

```bash
mkdir -p .cursor/rules
```

`.cursor/rules/create-article.mdc` を作成し、以下を記述してください：

```
---
description: AI Databaseの記事を作成する
globs:
alwaysApply: false
---

@skills/create-article.md の手順に従って記事を作成してください。
```

Cursorのチャットで以下のように呼び出します：

```
@create-article {記事化したいテーマや情報、URL等}
```

---

#### Cline / Roo Code（VS Code拡張）

`.clinerules` ファイルをリポジトリルートに作成し、以下を記述してください：

```
記事を作成するときは skills/create-article.md を読み込み、その手順に従ってください。
```

チャットで以下のように呼び出します：

```
skills/create-article.md に従って記事を作成して。テーマ：{テーマや情報、URL等}
```

---

#### GitHub Copilot（VS Code）

`.github/copilot-instructions.md` に以下を追記してください：

```markdown
## 記事作成

記事を作成する際は `skills/create-article.md` を参照して手順に従ってください。
```

Copilot Chatで以下のように呼び出します：

```
@workspace skills/create-article.md に従って記事を作成して。テーマ：{テーマや情報、URL等}
```

---

#### その他のAI（ChatGPT・Gemini等のチャット）

`skills/create-article.md` の内容をコピーしてチャットに貼り付け、末尾に記事化したい情報を追記してください。

---

### 4. 記事を作成する

AIエージェントに記事化したいテーマや情報・URLを渡すと、`data/articles/{ID}.md` が自動生成されます。

### 5. コミットする

追加された `.md` ファイル**のみ**をコミットします（`articles.json` は自動生成されるため不要）。

```bash
git add data/articles/{ID}.md
git commit -m "feat: {記事タイトル}の記事を追加"
```

### 6. プッシュしてプルリクエストを送る

```bash
git push -u origin feat/add-{記事の内容}
```

GitHubのリポジトリページを開き、「Compare & pull request」からPRを作成してください。

---

## PRマージ後の自動処理

`data/articles/` に変更があると GitHub Actions が自動で `data/articles.json` を再生成します。手動での更新は不要です。

---

## 注意事項

- 既存記事と内容・テーマが重複しないか確認してください（AIが自動チェックします）
- `lastVerified` は作成当日の日付を記入してください
- 情報源は実在するURLを記載してください
