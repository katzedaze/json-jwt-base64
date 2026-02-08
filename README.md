# Engineer's Web Toolbox

エンジニアが日常的に使う 3 つのツールをまとめた Web アプリケーション。
すべての処理はクライアントサイドで完結し、サーバーへのデータ送信は一切行いません。

![Home](docs/evidence/0-home.png)

## Tools

### JSON Formatter

JSON の整形・圧縮・バリデーションを行います。

- 左右 2 パネル構成（入力 / シンタックスハイライト付き出力）
- 整形・圧縮のトグル切り替え
- Ctrl+Enter で実行
- 構文エラー時は行番号付きエラー表示

![JSON Formatter](docs/evidence/2-1-json-format.png)

### Base64 Encoder / Decoder

Base64 のエンコード・デコードをリアルタイムで変換します。

- 入力内容から Encode / Decode を自動判定しバッジ表示
- 150ms デバウンスによるリアルタイム変換
- 1 文字ずつ流れるアニメーション演出

![Base64](docs/evidence/3-1-base64-encode.png)

### JWT Decoder

JWT トークンを解析し、Header / Payload / Signature を表示します。

- ペースト時に自動解析
- Header / Payload / Signature の 3 カード（展開・折りたたみ）
- 有効期限プログレスバー（緑 → 黄 → 赤）
- 標準フィールド（iss, sub, exp 等）のホバーツールチップ

![JWT Decoder](docs/evidence/4-1-jwt-parse.png)

## Tech Stack

| Category | Choice |
|----------|--------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS + Shadcn/UI |
| Animation | Framer Motion |
| Syntax Highlight | react-syntax-highlighter (Prism + oneDark) |
| JWT Parsing | jose |
| Package Manager | pnpm |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Production build
pnpm build

# Lint
pnpm lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/                        # Next.js App Router pages
├── layout.tsx              # Root layout (Sidebar + Main)
├── page.tsx                # Home (tool cards)
├── json-formatter/
├── base64/
└── jwt-decoder/
components/
├── layout/                 # Sidebar, MainContent
├── shared/                 # ToolPanel, CopyButton, ErrorDisplay
├── tools/                  # Tool-specific components
│   ├── json-formatter/
│   ├── base64/
│   └── jwt-decoder/
└── ui/                     # Shadcn/UI (auto-generated)
lib/
├── utils.ts                # Shadcn cn() utility
├── animations.ts           # Framer Motion shared variants
└── tools/                  # Pure business logic
    ├── json-utils.ts
    ├── base64-utils.ts
    └── jwt-utils.ts
```

## Security

- All processing runs client-side only
- No data is sent to any server
- No data is stored in localStorage or cookies
