# Git Worktree セットアップガイド

## 前提条件

セッション0（main ブランチでの共通レイアウト実装）が完了していること。

## 実行手順

### 1. セッション0完了後、mainブランチに git リポジトリがあることを確認

```bash
cd /home/katzedaze/workspace/worktree
git log --oneline -1
```

### 2. 各セッション用のブランチを作成し、worktree を展開

```bash
# セッション1: JSON整形ツール
git worktree add -b feature/json-formatter /home/katzedaze/workspace/worktree-json main

# セッション2: Base64エンコード/デコード
git worktree add -b feature/base64 /home/katzedaze/workspace/worktree-base64 main

# セッション3: JWTデコーダ
git worktree add -b feature/jwt-decoder /home/katzedaze/workspace/worktree-jwt main
```

### 3. 各 worktree で依存パッケージをインストール

```bash
cd /home/katzedaze/workspace/worktree-json && pnpm install
cd /home/katzedaze/workspace/worktree-base64 && pnpm install
cd /home/katzedaze/workspace/worktree-jwt && pnpm install
```

### 4. 各セッションに渡す Claude Code 起動コマンド

```bash
# ターミナル1（セッション1: JSON）
cd /home/katzedaze/workspace/worktree-json
claude

# ターミナル2（セッション2: Base64）
cd /home/katzedaze/workspace/worktree-base64
claude

# ターミナル3（セッション3: JWT）
cd /home/katzedaze/workspace/worktree-jwt
claude
```

各セッションで最初に以下を伝える:

- セッション1: `CLAUDE.md と docs/SESSION-1.md を読んで、その指示に従って実装してください`
- セッション2: `CLAUDE.md と docs/SESSION-2.md を読んで、その指示に従って実装してください`
- セッション3: `CLAUDE.md と docs/SESSION-3.md を読んで、その指示に従って実装してください`

## ディレクトリ構成（worktree 展開後）

```
/home/katzedaze/workspace/
├── worktree/              # main ブランチ（セッション0）
├── worktree-json/         # feature/json-formatter ブランチ（セッション1）
├── worktree-base64/       # feature/base64 ブランチ（セッション2）
└── worktree-jwt/          # feature/jwt-decoder ブランチ（セッション3）
```

## マージ手順（全セッション完了後）

```bash
cd /home/katzedaze/workspace/worktree

# 各ブランチをmainにマージ
git merge feature/json-formatter
git merge feature/base64
git merge feature/jwt-decoder
```

3つのブランチは担当ファイルが完全に分離しているため、コンフリクトは発生しない。

## worktree のクリーンアップ（マージ完了後）

```bash
git worktree remove /home/katzedaze/workspace/worktree-json
git worktree remove /home/katzedaze/workspace/worktree-base64
git worktree remove /home/katzedaze/workspace/worktree-jwt

git branch -d feature/json-formatter
git branch -d feature/base64
git branch -d feature/jwt-decoder
```

## ファイル担当マップ

各セッションが触れてよいファイルの一覧。これにより競合が起きないことを保証する。

| ファイル | Session 0 | Session 1 | Session 2 | Session 3 |
|---------|:---------:|:---------:|:---------:|:---------:|
| `app/layout.tsx` | **担当** | - | - | - |
| `app/page.tsx` | **担当** | - | - | - |
| `app/globals.css` | **担当** | - | - | - |
| `components/layout/*` | **担当** | - | - | - |
| `components/shared/*` | **担当** | - | - | - |
| `components/ui/*` | **担当** | - | - | - |
| `lib/utils.ts` | **担当** | - | - | - |
| `lib/animations.ts` | **担当** | - | - | - |
| `lib/tools/json-utils.ts` | - | **担当** | - | - |
| `components/tools/json-formatter/*` | - | **担当** | - | - |
| `app/json-formatter/page.tsx` | - | **担当** | - | - |
| `lib/tools/base64-utils.ts` | - | - | **担当** | - |
| `components/tools/base64/*` | - | - | **担当** | - |
| `app/base64/page.tsx` | - | - | **担当** | - |
| `lib/tools/jwt-utils.ts` | - | - | - | **担当** |
| `components/tools/jwt-decoder/*` | - | - | - | **担当** |
| `app/jwt-decoder/page.tsx` | - | - | - | **担当** |
