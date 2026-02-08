# セッション1: JSON 整形ツール

## 概要

JSON Formatter（整形・圧縮・バリデーション）機能を実装する。
`feature/json-formatter` ブランチで作業し、完了後にコミットする。

## 作業ディレクトリ

```
/home/katzedaze/workspace/worktree-json
```

このディレクトリは main ブランチから作成された git worktree である。

## 前提

- CLAUDE.md を読んでプロジェクト方針を把握すること
- セッション0（main ブランチ）の作業が完了済みであること
- 共通コンポーネント（ToolPanel, CopyButton, ErrorDisplay）は実装済み
- `lib/animations.ts` の共通バリアントは定義済み

## ブランチ

```
feature/json-formatter
```

## 触れてよいファイル（このセッションの担当範囲）

```
lib/tools/json-utils.ts                              # 新規作成
components/tools/json-formatter/json-syntax-display.tsx  # 新規作成
components/tools/json-formatter/json-diff-viewer.tsx     # 新規作成
components/tools/json-formatter/json-formatter-tool.tsx  # 新規作成
app/json-formatter/page.tsx                           # 新規作成
```

## 触れてはいけないファイル

以下は他セッションの担当であり、絶対に変更しない:
- `components/tools/base64/` 配下すべて
- `components/tools/jwt-decoder/` 配下すべて
- `lib/tools/base64-utils.ts`
- `lib/tools/jwt-utils.ts`
- `app/base64/`
- `app/jwt-decoder/`
- `components/layout/` 配下（共通レイアウトはセッション0で確定済み）
- `components/shared/` 配下（共通コンポーネントはセッション0で確定済み）
- `components/ui/` 配下（Shadcn 自動生成）
- `lib/animations.ts`（共通バリアントはセッション0で確定済み）

## 作業内容

### 1. `lib/tools/json-utils.ts`

純粋関数のみ。React 非依存。

```ts
formatJSON(input: string): { formatted: string | null; error: string | null; errorLine: number | null }
```
- `JSON.parse()` → `JSON.stringify(parsed, null, 2)`
- エラー時はメッセージからエラー行を抽出

```ts
minifyJSON(input: string): { minified: string | null; error: string | null }
```
- `JSON.parse()` → `JSON.stringify(parsed)`

```ts
validateJSON(input: string): { valid: boolean; error: string | null; errorLine: number | null }
```
- `JSON.parse()` の成否を判定

### 2. `components/tools/json-formatter/json-syntax-display.tsx`

- `"use client"` 必須
- react-syntax-highlighter の `Prism` コンポーネント + `oneDark` テーマ使用
- Props: `code: string`, `errorLine?: number`
- `showLineNumbers={true}`
- エラー行がある場合、`lineProps` でその行を赤背景 (`bg-red-900/30`) にハイライト
- Shadcn ScrollArea でスクロール対応

### 3. `components/tools/json-formatter/json-diff-viewer.tsx`

- `"use client"` 必須
- Props: `before: string`, `after: string`
- Framer Motion `AnimatePresence` + `motion.div` で整形前後をフェード切り替え
- 変更があった部分をカラーハイライトで視覚的に強調

### 4. `components/tools/json-formatter/json-formatter-tool.tsx`

- `"use client"` 必須
- メインのツールコンポーネント。ページから呼ばれる唯一のコンポーネント。
- レイアウト:
  - 上部: ツールバー（「整形」「圧縮」トグルボタン - Shadcn Tabs）
  - 下部: 左右 2 パネル構成（レスポンシブ: モバイルは縦積み）
    - 左: 入力 `<textarea>` を ToolPanel で囲む
    - 右: JsonSyntaxDisplay を ToolPanel で囲む（CopyButton 付き）
- キーボードショートカット:
  - `Ctrl+Enter` (Mac: `Cmd+Enter`) で整形/圧縮を実行
- エラー時: ErrorDisplay を表示
- 入力が空の場合はプレースホルダーテキストを表示
- Framer Motion で出力切り替え時のアニメーション

### 5. `app/json-formatter/page.tsx`

- JsonFormatterTool をインポートして表示するだけ
- `export default function JsonFormatterPage()`
- ロジックは持たない

### 6. 動作確認

```bash
pnpm build
```

ビルドが通ることを確認する。

### 7. コミット

```bash
git add -A
git commit -m "feat: JSON整形ツール実装（整形・圧縮・バリデーション・シンタックスハイライト）"
```

## 完了条件

- [ ] `pnpm build` がエラーなく通る
- [ ] `/json-formatter` にアクセスして入出力パネルが表示される
- [ ] 有効な JSON を入力して「整形」→ インデント付き出力が表示される
- [ ] 有効な JSON を入力して「圧縮」→ 1行に圧縮された出力が表示される
- [ ] 不正な JSON を入力 → エラーメッセージと行番号が表示される
- [ ] シンタックスハイライトが適用されている
- [ ] コピーボタンが動作する
- [ ] Ctrl+Enter で実行できる
- [ ] `feature/json-formatter` ブランチにコミット済み
