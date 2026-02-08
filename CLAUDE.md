# Engineer's Web Toolbox

## プロジェクト概要

エンジニアが日常的に使う3つのツールをまとめたWebアプリケーション。

- **JSON Formatter** - JSON整形・圧縮・バリデーション
- **Base64 Encoder/Decoder** - Base64エンコード・デコード（自動判定付き）
- **JWT Decoder** - JWTトークンの解析・有効期限表示

すべての処理はクライアントサイドで完結する。サーバーへのデータ送信は一切行わない。
ビジュアル重視でFramer Motionによるアニメーション演出を多用する。

---

## 技術スタック

| カテゴリ | 選定 |
|---------|------|
| フレームワーク | Next.js (App Router) |
| 言語 | TypeScript (strict) |
| スタイリング | TailwindCSS + Shadcn/UI |
| アニメーション | Framer Motion |
| シンタックスハイライト | react-syntax-highlighter (Prism + oneDark) |
| JWT解析 | jose |
| パッケージマネージャ | pnpm |

---

## コマンド

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm lint         # ESLint実行
```

---

## ディレクトリ構造

```
worktree/
├── app/                        # Next.js App Router ページ
│   ├── layout.tsx              # ルートレイアウト（サイドバー + メイン）
│   ├── page.tsx                # ホームページ（ツール一覧カード）
│   ├── globals.css             # グローバルスタイル
│   ├── json-formatter/
│   │   └── page.tsx
│   ├── base64/
│   │   └── page.tsx
│   └── jwt-decoder/
│       └── page.tsx
├── components/
│   ├── layout/                 # レイアウト系コンポーネント
│   │   ├── sidebar.tsx
│   │   └── main-content.tsx
│   ├── shared/                 # 全ツール共通コンポーネント
│   │   ├── tool-panel.tsx
│   │   ├── copy-button.tsx
│   │   └── error-display.tsx
│   ├── tools/                  # ツール固有コンポーネント
│   │   ├── json-formatter/
│   │   ├── base64/
│   │   └── jwt-decoder/
│   └── ui/                     # Shadcn/UI 自動生成（手動編集しない）
├── lib/
│   ├── utils.ts                # Shadcn cn() ユーティリティ
│   ├── animations.ts           # Framer Motion 共通バリアント
│   └── tools/                  # ツール固有のビジネスロジック
│       ├── json-utils.ts
│       ├── base64-utils.ts
│       └── jwt-utils.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── components.json             # Shadcn設定
└── next.config.ts
```

### 配置ルール

- **ページファイル** (`app/*/page.tsx`): ツールのメインコンポーネントをimportして表示するだけ。ロジックを持たない。
- **ツールコンポーネント** (`components/tools/*/`): UIとインタラクションロジックを持つ。ビジネスロジックは`lib/tools/`に委譲する。
- **ビジネスロジック** (`lib/tools/`): 純粋関数のみ。React非依存。UIコンポーネントをimportしない。
- **共通コンポーネント** (`components/shared/`): 複数ツールで再利用されるUI部品。ツール固有のロジックを持たない。
- **Shadcn/UIコンポーネント** (`components/ui/`): `pnpm dlx shadcn@latest add`で自動生成。手動編集しない。

---

## コーディング規約

### 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| ファイル名 | kebab-case | `json-formatter-tool.tsx` |
| コンポーネント | PascalCase | `JsonFormatterTool` |
| 関数 | camelCase | `formatJSON()`, `decodeBase64()` |
| 型・interface | PascalCase | `JWTPayload`, `FormatResult` |
| 定数 | UPPER_SNAKE_CASE | `MAX_INPUT_LENGTH` |
| CSS class | TailwindCSS ユーティリティのみ | カスタムCSSは原則書かない |

### コンポーネントの書き方

```tsx
// 1. "use client" はクライアント機能を使う場合のみ先頭に記述
"use client";

// 2. import順序: React/Next → 外部ライブラリ → 内部モジュール → 型
import { useState } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/shared/copy-button";
import type { FormatResult } from "@/lib/tools/json-utils";

// 3. Props型はコンポーネント直上に定義
interface JsonSyntaxDisplayProps {
  code: string;
  errorLine?: number;
}

// 4. named export を使用（default export はページのみ）
export function JsonSyntaxDisplay({ code, errorLine }: JsonSyntaxDisplayProps) {
  return (/* ... */);
}
```

### "use client" の判断基準

以下のいずれかを使う場合に `"use client"` を付ける:
- `useState`, `useEffect`, `useRef` 等のReact hooks
- `usePathname()` 等のNext.jsクライアントhooks
- `onClick`, `onChange` 等のイベントハンドラ
- Framer Motionの `motion` コンポーネント
- `navigator.clipboard` 等のブラウザAPI

### アニメーション

Framer Motionのバリアントは `lib/animations.ts` に共通定義し、各コンポーネントから参照する。

```tsx
// lib/animations.ts で定義済みのバリアントを使う
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";

<motion.div variants={fadeIn} initial="hidden" animate="visible">
```

ツール固有のアニメーション（文字フローなど）はツールコンポーネント内で定義してよい。

### エラーハンドリング

- ビジネスロジック関数は例外をthrowせず、`{ result, error }` 形式で返す。
- UIコンポーネント側で `error` の有無を判定して `ErrorDisplay` を表示する。

```ts
// Good
function formatJSON(input: string): { formatted: string | null; error: string | null } { ... }

// Bad - throw しない
function formatJSON(input: string): string { throw new Error(...); }
```

---

## 共通コンポーネントの使い方

### ToolPanel

入出力エリアの共通コンテナ。全ツールページで使用する。

```tsx
import { ToolPanel } from "@/components/shared/tool-panel";

<ToolPanel title="Input" actions={<CopyButton text={input} />}>
  <textarea value={input} onChange={...} />
</ToolPanel>
```

### CopyButton

クリップボードコピー + チェックマークアニメーション。

```tsx
import { CopyButton } from "@/components/shared/copy-button";

<CopyButton text={outputText} />
```

### ErrorDisplay

エラーメッセージ表示。Framer Motionでスライドイン。

```tsx
import { ErrorDisplay } from "@/components/shared/error-display";

{error && <ErrorDisplay message={error} line={errorLine} />}
```

---

## 各ツール仕様

### JSON Formatter (`/json-formatter`)

- 左右2パネル構成（入力 / ハイライト付き出力）
- 「整形」「圧縮」のトグルボタン
- Ctrl+Enter で実行
- 構文エラー時は行番号付きエラー表示、エラー行を赤背景ハイライト
- 整形前後のフェードアニメーション

### Base64 (`/base64`)

- 2パネル構成（入力 / 出力）
- 入力内容からエンコード/デコードを自動判定しバッジ表示
- リアルタイム変換（150msデバウンス）
- 文字が1文字ずつ流れるアニメーション

### JWT Decoder (`/jwt-decoder`)

- 入力テキストエリア + Header / Payload / Signature の3カード
- ペースト時に自動解析
- カード展開/折りたたみアニメーション
- 有効期限プログレスバー（緑→黄グラデーション / 期限切れは赤）
- 標準フィールド (iss, sub, aud, exp, iat, nbf, jti) のホバーツールチップ

---

## Shadcn/UI 使用コンポーネント

```
button, card, textarea, separator, scroll-area, tooltip, tabs, progress, badge, alert
```

追加時は `pnpm dlx shadcn@latest add <component>` を使用する。

---

## 注意事項

- すべての処理はクライアントサイドで行う。API Routeは作成しない。
- ユーザーデータはサーバーに送信しない。localStorage等への保存も行わない。
- `components/ui/` 配下のShadcnコンポーネントは手動編集しない。カスタマイズはラッパーコンポーネントで対応する。
- Framer Motionのアニメーションは`prefers-reduced-motion`を考慮する。
