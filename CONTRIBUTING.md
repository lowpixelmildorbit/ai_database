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

### 2. AIエージェントで記事を作成する

クローンするだけで、以下の各AIエージェントがすぐに使えます。追加のセットアップは不要です。

記事化したいテーマや情報・URLを渡すと、ブランチ作成・コミット・プッシュ・PR作成まで自動で行われます。

---

#### Claude Code

リポジトリフォルダで Claude Code を開き、以下のように指示します：

```
/create-article {記事化したいテーマや情報、URL等}
```

---

#### Antigravity

`GEMINI.md` により設定済みです。チャットで以下のように指示します：

```
{記事化したいテーマや情報、URL等}の記事を作成して
```

---

#### Cursor / Windsurf / RooCode / Aider

`AGENTS.md` により設定済みです。チャットで以下のように指示します：

```
{記事化したいテーマや情報、URL等}の記事を作成して
```

---

#### Cline（VS Code拡張）

`.clinerules` により設定済みです。チャットで以下のように指示します：

```
{記事化したいテーマや情報、URL等}の記事を作成して
```

---

#### GitHub Copilot（VS Code）

`.github/copilot-instructions.md` により設定済みです。Copilot Chatで以下のように指示します：

```
@workspace {記事化したいテーマや情報、URL等}の記事を作成して
```

---

#### その他のAI（ChatGPT・Gemini等のチャット）

`skills/create-article.md` の内容をコピーしてチャットに貼り付け、末尾に記事化したい情報を追記してください。

---

## PRマージ後の自動処理

`data/articles/` に変更があると GitHub Actions が自動で `data/articles.json` を再生成します。手動での更新は不要です。

---

## 注意事項

- 既存記事と内容・テーマが重複しないか確認してください（AIが自動チェックします）
- `lastVerified` は作成当日の日付を記入してください
- 情報源は実在するURLを記載してください
