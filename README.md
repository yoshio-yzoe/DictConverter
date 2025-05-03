# 辞書変換ツール – Google 日本語 ↔ macOS ユーザー辞書

 Google 日本語入力のユーザー辞書（.txt） と macOS ユーザー辞書（.plist） を相互変換するシンプルな Web アプリです。

## 使い方
[GitHub Pages](https://yoshio-yzoe.github.io/DictConverter/)から直接利用可能。

1. **入力**  
   - ファイルを選択するか、テキストボックスに貼り付けます。 
   - ドラッグ＆ドロップにも対応。

2. **モード選択**
   1でファイルをアップロードした場合、自動で選択されます。
   
   | ラジオボタン | 説明 |
   |--------------|------|
   | **IME → Mac** | Google 日本語入力書き出し (`*.txt`) → macOS 辞書 (`userdict.plist`) |
   | **Mac → IME** | macOS 辞書 (`*.plist`) → Google 日本語入力 (`userdict.txt`) |

3. **変換**  
   「変換」ボタンを押すと右側に結果が表示され、同時にダウンロードリンクが生成されます。

4. **コピー / ダウンロード**  
   - **コピー**: クリップボードへコピー  
   - **ダウンロード**: 変換済みファイルを保存（ファイル名は自動付与）
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

## 動作確認環境
- Chrome / Edge / Safari / Firefox 最新版
- iOS / Android モバイルブラウザ
