# セッション2: Base64 エンコード/デコード

## 概要

Base64 エンコード・デコード機能を実装する。
`feature/base64` ブランチで作業し、完了後にコミットする。

## 作業ディレクトリ

```
/home/katzedaze/workspace/worktree-base64
```

このディレクトリは main ブランチから作成された git worktree である。

## 前提

- CLAUDE.md を読んでプロジェクト方針を把握すること
- セッション0（main ブランチ）の作業が完了済みであること
- 共通コンポーネント（ToolPanel, CopyButton, ErrorDisplay）は実装済み
- `lib/animations.ts` の共通バリアントは定義済み

## ブランチ

```
feature/base64
```

## 触れてよいファイル（このセッションの担当範囲）

```
lib/tools/base64-utils.ts                          # 新規作成
components/tools/base64/character-flow-animation.tsx   # 新規作成
components/tools/base64/base64-tool.tsx                # 新規作成
app/base64/page.tsx                                 # 新規作成
```

## 触れてはいけないファイル

以下は他セッションの担当であり、絶対に変更しない:
- `components/tools/json-formatter/` 配下すべて
- `components/tools/jwt-decoder/` 配下すべて
- `lib/tools/json-utils.ts`
- `lib/tools/jwt-utils.ts`
- `app/json-formatter/`
- `app/jwt-decoder/`
- `components/layout/` 配下（共通レイアウトはセッション0で確定済み）
- `components/shared/` 配下（共通コンポーネントはセッション0で確定済み）
- `components/ui/` 配下（Shadcn 自動生成）
- `lib/animations.ts`（共通バリアントはセッション0で確定済み）

## 作業内容

### 1. `lib/tools/base64-utils.ts`

純粋関数のみ。React 非依存。

```ts
encodeBase64(input: string): string
```
- `btoa(unescape(encodeURIComponent(input)))` でUTF-8対応エンコード

```ts
decodeBase64(input: string): { decoded: string | null; error: string | null }
```
- `decodeURIComponent(escape(atob(input)))` でUTF-8対応デコード
- 不正な Base64 文字列の場合はエラーを返す

```ts
isBase64(input: string): boolean
```
- 正規表現 (`/^[A-Za-z0-9+/]*={0,2}$/`) でフォーマットチェック
- かつ試行デコードが成功するかで判定
- 空文字列や短すぎる文字列は false

### 2. `components/tools/base64/character-flow-animation.tsx`

- `"use client"` 必須
- Props: `text: string`, `direction?: "encode" | "decode"`
- Framer Motion `staggerChildren` で文字が 1 文字ずつ流れるように表示
- `direction` に応じてアニメーション方向を変える:
  - encode: 左→右
  - decode: 右→左
- 長いテキストの場合は先頭 N 文字のみアニメーションし、残りは一括表示
- `prefers-reduced-motion` を考慮

### 3. `components/tools/base64/base64-tool.tsx`

- `"use client"` 必須
- メインのツールコンポーネント。ページから呼ばれる唯一のコンポーネント。
- レイアウト:
  - 上下 or 左右の 2 パネル構成（レスポンシブ: モバイルは縦積み）
    - 上/左: 入力 `<textarea>` を ToolPanel で囲む
    - 下/右: CharacterFlowAnimation + 出力テキスト表示を ToolPanel で囲む（CopyButton 付き）
- 自動判定ロジック:
  - 入力変更時に `isBase64()` で判定
  - Base64 と判定 → デコードモード（Shadcn Badge で「Decode」表示）
  - それ以外 → エンコードモード（Shadcn Badge で「Encode」表示）
- リアルタイム変換:
  - 入力変更から 150ms のデバウンスで変換実行
  - `useEffect` + `setTimeout` / `clearTimeout` パターン
- エラー時: ErrorDisplay を表示
- 入力が空の場合はプレースホルダーテキストを表示
- Framer Motion で出力切り替え時のアニメーション

### 4. `app/base64/page.tsx`

- Base64Tool をインポートして表示するだけ
- `export default function Base64Page()`
- ロジックは持たない

### 5. 動作確認

```bash
pnpm build
```

ビルドが通ることを確認する。

### 6. コミット

```bash
git add -A
git commit -m "feat: Base64エンコード/デコードツール実装（自動判定・リアルタイム変換・文字フローアニメーション）"
```

## 完了条件

- [ ] `pnpm build` がエラーなく通る
- [ ] `/base64` にアクセスして入出力パネルが表示される
- [ ] テキスト入力 → Base64 エンコード結果が表示される
- [ ] Base64 文字列入力 → 自動判定でデコードされる
- [ ] モードバッジ（Encode/Decode）が正しく表示される
- [ ] リアルタイム変換が動作する（入力から少し遅れて出力が更新される）
- [ ] 不正な Base64 入力 → エラーが表示される
- [ ] 文字フローアニメーションが動作する
- [ ] コピーボタンが動作する
- [ ] `feature/base64` ブランチにコミット済み
