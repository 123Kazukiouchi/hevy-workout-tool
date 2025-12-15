# GitHub公開ガイド

このファイルでは、HEVY ワークアウト登録ツールをGitHubに公開する手順を説明します。

---

## 📋 前提条件

- ✅ GitHubアカウントを持っている
- ✅ Gitがインストールされている
- ✅ プロジェクトファイルがローカルにある

---

## 🚀 公開手順

### **Step 1: GitHubで新しいリポジトリを作成**

1. [GitHub](https://github.com/)にログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ情報を入力：
   - **Repository name**: `hevy-workout-tool`
   - **Description**: `日本語トレーニングデータを自動でHEVYアプリに登録するWebツール`
   - **Public/Private**: Public（公開）を選択
   - **Initialize this repository with**: 何もチェックしない（既存プロジェクトのため）
4. 「Create repository」をクリック

---

### **Step 2: ローカルリポジトリを初期化**

プロジェクトフォルダで以下のコマンドを実行：

```bash
# Gitリポジトリを初期化
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: HEVY Workout Tool v6.3"

# mainブランチに名前を変更（必要に応じて）
git branch -M main

# リモートリポジトリを追加（GitHubのURLに置き換えてください）
git remote add origin https://github.com/yourusername/hevy-workout-tool.git

# GitHubにプッシュ
git push -u origin main
```

---

### **Step 3: GitHub Pagesを有効化**

1. GitHubのリポジトリページに移動
2. 「Settings」タブをクリック
3. 左サイドバーで「Pages」を選択
4. **Source**セクションで：
   - **Branch**: `main` を選択
   - **Folder**: `/ (root)` を選択
5. 「Save」をクリック

数分後、以下のURLでアクセス可能になります：
```
https://yourusername.github.io/hevy-workout-tool/
```

---

### **Step 4: リポジトリの設定**

#### **Aboutセクションの編集**

1. リポジトリのトップページで「⚙️」（設定アイコン）をクリック
2. 以下を入力：
   - **Description**: `日本語トレーニングデータを自動でHEVYアプリに登録するWebツール`
   - **Website**: `https://yourusername.github.io/hevy-workout-tool/`
   - **Topics**: `hevy`, `workout`, `fitness`, `japanese`, `training`, `webapp`
3. 「Save changes」をクリック

#### **トピックの追加**

以下のトピックを追加することをお勧めします：
- `hevy`
- `workout-tracker`
- `fitness`
- `training-log`
- `japanese`
- `static-site`
- `web-app`

---

### **Step 5: README.mdのURLを更新**

`README.md`内の以下のプレースホルダーを実際のURLに置き換えてください：

```markdown
# 置き換え前
https://github.com/yourusername/hevy-workout-tool

# 置き換え後
https://github.com/あなたのユーザー名/hevy-workout-tool
```

変更後、再度コミット＆プッシュ：

```bash
git add README.md
git commit -m "Update URLs in README"
git push
```

---

## 🎨 オプション設定

### **ソーシャルイメージの追加**

1. プロジェクトのスクリーンショットを作成（1280x640px推奨）
2. リポジトリの「Settings」→「Options」
3. 「Social preview」セクションで「Edit」
4. 画像をアップロード

### **ライセンスバッジの追加**

README.mdに以下を追加（既に追加済み）：

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
```

### **Issueテンプレートの作成**

`.github/ISSUE_TEMPLATE/`フォルダを作成し、以下のファイルを追加：

- `bug_report.md` - バグ報告用
- `feature_request.md` - 機能要望用

---

## 📢 公開後の推奨事項

### **1. リリースを作成**

1. GitHubのリポジトリページで「Releases」をクリック
2. 「Create a new release」をクリック
3. タグを作成：`v6.3.0`
4. リリースタイトル：`v6.3.0 - 未来のトレーニング登録機能追加`
5. 変更内容を記載（CHANGELOG.mdから転記）
6. 「Publish release」をクリック

### **2. SNSで共有**

- Twitter/X
- Reddit（r/fitness, r/hevy など）
- フィットネス関連のフォーラム

### **3. 継続的なメンテナンス**

- ⭐ スターをもらったら感謝のコメント
- 🐛 Issueには迅速に対応
- 📝 定期的にREADME.mdを更新
- 🔄 新機能を追加したらCHANGELOG.mdを更新

---

## 🔒 セキュリティ

### **APIキーの取り扱い**

- ❌ APIキーをコードにハードコーディングしない
- ✅ LocalStorageに保存する現在の方式を維持
- ✅ README.mdで注意喚起を継続

### **脆弱性の報告**

セキュリティ上の問題を発見した場合：
1. 公開Issueでは報告しない
2. プライベートメッセージまたはメールで連絡
3. 修正後に公開

---

## 📊 アナリティクス（オプション）

GitHub Insights で以下を追跡できます：
- 訪問者数
- クローン数
- リファラー
- 人気のコンテンツ

---

## ❓ トラブルシューティング

### **GitHub Pagesが表示されない**

- 数分待つ（最大10分）
- Actions タブで "pages build and deployment" が成功しているか確認
- Settings → Pages で正しく設定されているか確認

### **プッシュできない**

```bash
# リモートURLを確認
git remote -v

# HTTPSからSSHに変更する場合
git remote set-url origin git@github.com:yourusername/hevy-workout-tool.git
```

---

## 🎉 完了！

以上で、GitHubへの公開は完了です。

**次のステップ：**
- [ ] リポジトリURLをREADME.mdに追加
- [ ] GitHub Pagesで動作確認
- [ ] 初回リリース（v6.3.0）を作成
- [ ] SNSで共有
- [ ] ⭐スターを集める！

---

ご質問や問題がある場合は、GitHubのIssuesでお知らせください。
