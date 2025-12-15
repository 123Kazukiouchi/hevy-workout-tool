# コントリビューションガイド

HEVY ワークアウト登録ツールへの貢献に興味を持っていただき、ありがとうございます！🎉

## 🚀 始め方

### 1. リポジトリをフォーク

右上の「Fork」ボタンをクリックして、このリポジトリを自分のアカウントにフォークします。

### 2. ローカルにクローン

```bash
git clone https://github.com/yourusername/hevy-workout-tool.git
cd hevy-workout-tool
```

### 3. ブランチを作成

```bash
git checkout -b feature/your-feature-name
```

ブランチ名の例：
- `feature/add-new-exercise-translation` - 新機能追加
- `bugfix/fix-parsing-error` - バグ修正
- `docs/update-readme` - ドキュメント更新

---

## 📝 コードスタイル

### **HTML/CSS/JavaScript**

- **インデント**: スペース2つ
- **命名規則**: キャメルケース（JavaScript）、ケバブケース（CSS）
- **コメント**: 日本語でOK（多言語対応の場合は英語も併記）

### **コミットメッセージ**

```
[種類] 簡潔な説明

詳細な説明（必要に応じて）
```

**種類の例：**
- `[feat]` - 新機能追加
- `[fix]` - バグ修正
- `[docs]` - ドキュメント更新
- `[style]` - UIデザイン変更
- `[refactor]` - コードリファクタリング
- `[test]` - テスト追加
- `[chore]` - その他の変更

**例：**
```
[feat] HEVYエクスポート形式のパーサーを追加

bullet point形式（「• 80kg × 5回」）に対応し、
メタデータ行を自動的にスキップする機能を実装。
```

---

## 🔍 プルリクエストのガイドライン

### **プルリクエストを作成する前に：**

1. ✅ コードが正しく動作することを確認
2. ✅ 既存の機能を壊していないことを確認
3. ✅ README.mdを更新（必要に応じて）
4. ✅ コミットメッセージが明確であることを確認

### **プルリクエストのテンプレート：**

```markdown
## 概要
（何を変更したか）

## 変更内容
- 変更点1
- 変更点2

## 動作確認
- [ ] ブラウザでindex.htmlを開いて動作確認
- [ ] 既存機能が動作することを確認
- [ ] 新機能が正しく動作することを確認

## スクリーンショット
（必要に応じて）

## 関連Issue
Closes #123
```

---

## 🐛 バグ報告

バグを見つけた場合は、[Issues](https://github.com/yourusername/hevy-workout-tool/issues/new)で報告してください。

### **バグ報告テンプレート：**

```markdown
## バグの説明
（何が起きたか）

## 再現手順
1. XXXを開く
2. YYYをクリック
3. ZZZが表示される

## 期待される動作
（本来どうあるべきか）

## 環境
- ブラウザ: Chrome 120.0.0
- OS: Windows 11

## スクリーンショット
（あれば）
```

---

## 💡 機能要望

新しい機能のアイデアがある場合は、[Issues](https://github.com/yourusername/hevy-workout-tool/issues/new)で提案してください。

### **機能要望テンプレート：**

```markdown
## 機能の説明
（どんな機能か）

## 動機・背景
（なぜ必要か）

## 期待される動作
（どう動作すべきか）

## 代替案
（他の方法はあるか）
```

---

## 🎯 開発のヒント

### **ファイル構造**

```
hevy-workout-tool/
├── index.html          # メインアプリケーション
├── README.md           # プロジェクトドキュメント
├── CONTRIBUTING.md     # このファイル
├── LICENSE             # MITライセンス
└── .gitignore          # Git除外設定
```

### **主要な関数（index.html内）**

- `parseWorkoutData(text)` - データ解析（line 783～）
- `translateToEnglish(japaneseText)` - 日本語→英語翻訳
- `searchAndFillTemplateIds()` - 自動マッチング（line 1188～）
- `collectPayload()` - API送信用データ作成（line 1813～）

### **デバッグ方法**

1. ブラウザのDevTools（F12）を開く
2. Consoleタブでログを確認
3. `console.log()` を追加してデバッグ

---

## 📚 参考リソース

- [HEVY REST API ドキュメント](https://docs.hevyapp.com/)（架空のURL）
- [JavaScript MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [HTML Living Standard](https://html.spec.whatwg.org/)

---

## ❓ 質問

何か質問がある場合は、[Discussions](https://github.com/yourusername/hevy-workout-tool/discussions)または[Issues](https://github.com/yourusername/hevy-workout-tool/issues)でお気軽にお尋ねください。

---

ご協力ありがとうございます！🙏
