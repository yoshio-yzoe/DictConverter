# 辞書変換ツール – Google 日本語 ↔ macOS ユーザー辞書

日本語入力用の **Google 日本語入力（.txt）** と **macOS ユーザー辞書（.plist）** を相互変換するシンプルな Web アプリです。 

---

## 目次
1. [特徴](#特徴)
2. [ファイル構成](#ファイル構成)
3. [使い方](#使い方)
4. [変換仕様](#変換仕様)
5. [開発](#開発)
6. [ライセンス](#ライセンス)

---

## 特徴
- ✅ **双方向変換**  
  - *IME → macOS*（タブ区切り TXT → plist）  
  - *macOS → IME*（plist → タブ区切り TXT）
- ✅ **ブラウザだけで完結**（モダンブラウザ対応）
- ✅ **ドラッグ＆ドロップ / クリップボードコピー / ダウンロード** 対応
- ✅ **ダークモード自動対応**
- ✅ 依存ライブラリなし

---

## ファイル構成

```
./
├── index.html      … 画面 UI
├── style.css       … レイアウト & テーマ
├── convert.js      … 変換ロジック（旧: translate.js）
└── README.md
```

> **NOTE**  
> `translate.js` は `convert.js` に改名されています。古いファイルは不要です。

---

## 使い方
[GitHub Pages](https://yoshio-yzoe.github.io/DictConverter/)から直接利用可能。以下はローカルで実行する手順

1. **ダウンロード / クローン**

   ```bash
   git clone https://github.com/your-name/dict-converter.git
   cd dict-converter
   ```

2. **`index.html` を開く**  
   *ダブルクリック* もしくは VS Code Live Server / `python -m http.server` など任意の静的サーバで。

3. **モード選択**

   | ラジオボタン | 説明 |
   |--------------|------|
   | **IME → Mac** | Google 日本語入力書き出し (`*.txt`) → macOS 辞書 (`userdict.plist`) |
   | **Mac → IME** | macOS 辞書 (`*.plist`) → Google 日本語入力 (`userdict.txt`) |

4. **入力**  
   - ファイルを選択するか、テキストボックスに貼り付けます。  
   - ドラッグ＆ドロップにも対応。

5. **変換**  
   「変換」ボタンを押すと右側に結果が表示され、同時にダウンロードリンクが生成されます。

6. **コピー / ダウンロード**  
   - **コピー**: クリップボードへコピー  
   - **ダウンロード**: 変換済みファイルを保存（ファイル名は自動付与）

---

## 変換仕様

### IME (TXT) → macOS (plist)

| IME フィールド | plist キー |
|----------------|-----------|
| 1列目: 読み (shortcut) | `<key>shortcut</key>` |
| 2列目: 単語 (phrase)  | `<key>phrase</key>`  |

その他列（品詞など）は無視します。  
XML 予約文字 `<`, `>`, `&`, `'`, `"` はエスケープ処理済み。

### macOS (plist) → IME (TXT)

- `<dict>` 配下の `<key>phrase</key> + <string>` と  
  `<key>shortcut</key> + <string>` を走査
- 出力は **「読み\t単語\t名詞\t」**（Google 互換）形式
- `<` `>` を含むレコードはスキップ

---

## 開発

### 動作確認環境
- Chrome / Edge / Safari / Firefox 最新版
- iOS / Android モバイルブラウザ

### コーディング規約
- ES2021 (`const` / `let`, テンプレートリテラル)
- グローバル汚染防止の即時実行関数 (IIFE)
- 依存ゼロ（フレームワーク不使用）

### 主要タスク

| コマンド | 説明 |
|----------|------|
| `npm run lint` | ESLint で静的解析（任意導入） |
| `npm run format` | Prettier で整形（任意導入） |

> **Tip**  
> 発展タスクとして「重複エントリ自動マージ」「かな自動判定」などの追加も容易に行えます。

---

## ライセンス

本リポジトリは **MIT License** です。  
商用・非商用問わず自由にご利用ください。
