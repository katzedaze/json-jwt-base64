# セッション0: プロジェクト初期化 + 共通レイアウト

## 概要

mainブランチ上でプロジェクトの基盤を構築する。
他の3セッション（JSON / Base64 / JWT）がこのmainブランチをベースに作業するため、
このセッションの完了が全体の前提条件となる。

## 作業ディレクトリ

```
/home/katzedaze/workspace/worktree
```

## 前提

- CLAUDE.md を読んでプロジェクト方針を把握すること
- このセッションは main ブランチで作業する

## 作業内容

以下を順番に実施し、すべて完了したら main ブランチにコミットする。

### 1. プロジェクト初期化

```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src=false --import-alias="@/*" --turbopack --use-pnpm
```

### 2. Shadcn/UI セットアップ

```bash
pnpm dlx shadcn@latest init
```

設定値:
- Style: Default
- Base color: Slate
- CSS variables: Yes

### 3. Shadcn/UI コンポーネント追加

```bash
pnpm dlx shadcn@latest add button card textarea separator scroll-area tooltip tabs progress badge alert
```

### 4. 依存パッケージインストール

```bash
pnpm add framer-motion react-syntax-highlighter jose
pnpm add -D @types/react-syntax-highlighter
```

### 5. ディレクトリ構造作成

```bash
mkdir -p components/layout components/shared components/tools/json-formatter components/tools/base64 components/tools/jwt-decoder lib/tools
```

### 6. 共通ファイル実装

以下のファイルを実装する。CLAUDE.md のコーディング規約に従うこと。

#### `lib/animations.ts`
Framer Motion の共通バリアント定義。以下を export する:
- `fadeIn` - フェードイン (opacity 0→1)
- `slideUp` - 下から上へスライドイン (y: 20→0 + opacity)
- `staggerContainer` - 子要素を順番に表示 (staggerChildren: 0.1)
- `cardExpand` - カード展開 (scale: 0.95→1 + opacity)
- `slideIn` - 横からスライドイン (x: -20→0 + opacity)

#### `app/globals.css`
TailwindCSS のベース設定。Shadcn/UI が生成した内容をベースに、必要に応じてダークテーマ用のCSS変数を調整。

#### `app/layout.tsx`
- ルートレイアウト
- `<html lang="ja">` で日本語設定
- サイドバー + メインコンテンツの flex 構成
- フォント: `Inter` (next/font/google)
- Sidebar と MainContent コンポーネントを配置

#### `components/layout/sidebar.tsx` (Client Component)
- `"use client"` 必須（usePathname, onClick 使用）
- `usePathname()` でアクティブ状態を判定
- ナビゲーション項目:
  - Home (`/`) - Home アイコン
  - JSON Formatter (`/json-formatter`) - Braces アイコン
  - Base64 (`/base64`) - ArrowLeftRight アイコン
  - JWT Decoder (`/jwt-decoder`) - Key アイコン
- アイコンは lucide-react を使用（Shadcn/UI に同梱）
- デスクトップ: 固定幅 w-64、常時表示、左端に配置
- モバイル: ハンバーガーメニューボタンで開閉、オーバーレイ付き
- Framer Motion でホバーエフェクト・アクティブ状態のアニメーション
- ダークテーマ基調のデザイン（bg-slate-900 系）

#### `components/layout/main-content.tsx`
- メインコンテンツのラッパー
- `children` を受け取って表示
- Framer Motion の `AnimatePresence` でページ遷移アニメーション
- パディング・最大幅の設定

#### `components/shared/tool-panel.tsx`
- Shadcn Card ベースの入出力パネル
- Props: `title: string`, `children: ReactNode`, `actions?: ReactNode`
- ヘッダーにタイトルとアクションボタン配置エリア
- Framer Motion で表示時のフェードインアニメーション

#### `components/shared/copy-button.tsx` (Client Component)
- `"use client"` 必須（useState, onClick, navigator.clipboard 使用）
- Props: `text: string`
- Shadcn Button (variant="ghost", size="icon")
- `navigator.clipboard.writeText()` でコピー
- コピー成功時: Copy アイコン → Check アイコンに 2 秒間変化
- Framer Motion でアイコン切り替えアニメーション

#### `components/shared/error-display.tsx` (Client Component)
- `"use client"` 必須（Framer Motion 使用）
- Props: `message: string`, `line?: number`
- Shadcn Alert (variant="destructive") ベース
- line が指定されている場合は「行 {line}:」をプレフィックス表示
- Framer Motion で slideUp アニメーション（AnimatePresence 対応）

#### `app/page.tsx`
- ホームページ：3つのツールカードを表示
- 各カードにツール名・説明・アイコン・リンク
- Framer Motion の staggerContainer で順番にフェードイン
- カードホバーで scale アップアニメーション

### 7. 動作確認

```bash
pnpm build
```

ビルドが通ることを確認する。

### 8. コミット

すべてのファイルを main ブランチにコミットする。

```bash
git add -A
git commit -m "feat: プロジェクト初期化・共通レイアウト・共通コンポーネント実装"
```

## 触れてはいけないファイル

このセッションでは以下のツール固有ファイルは作成しない（空ディレクトリのみ）:
- `app/json-formatter/page.tsx`
- `app/base64/page.tsx`
- `app/jwt-decoder/page.tsx`
- `components/tools/` 配下の各ツールコンポーネント
- `lib/tools/` 配下の各ユーティリティ

## 完了条件

- [x] `pnpm build` がエラーなく通る
- [x] サイドバーに4つのリンク（Home, JSON, Base64, JWT）が表示される
- [x] ホームページに3つのツールカードが表示される
- [x] 共通コンポーネント（ToolPanel, CopyButton, ErrorDisplay）が実装されている
- [x] main ブランチにコミット済み
