# 作業リスト

## Phase 1: プロジェクト基盤

- [x] Next.js プロジェクト初期化 (`pnpm create next-app@latest`)
- [x] Shadcn/UI セットアップ (`pnpm dlx shadcn@latest init`)
- [x] Shadcn/UI コンポーネント追加 (button, card, textarea, separator, scroll-area, tooltip, tabs, progress, badge, alert)
- [x] 依存パッケージインストール (`framer-motion`, `react-syntax-highlighter`, `@types/react-syntax-highlighter`, `jose`)
- [x] ディレクトリ構造作成 (`components/layout/`, `components/shared/`, `components/tools/`, `lib/tools/`)
- [x] `lib/animations.ts` - Framer Motion 共通バリアント定義 (fadeIn, slideUp, staggerContainer, cardExpand)

## Phase 2: レイアウト・共通コンポーネント

- [x] `app/globals.css` - グローバルスタイル調整
- [x] `app/layout.tsx` - ルートレイアウト（サイドバー + メイン領域のflex構成）
- [x] `components/layout/sidebar.tsx` - サイドバーナビゲーション（レスポンシブ対応、アクティブ状態、ホバーエフェクト）
- [x] `components/layout/main-content.tsx` - メインコンテンツラッパー
- [x] `components/shared/tool-panel.tsx` - 入出力パネル共通コンテナ（Shadcn Card ベース）
- [x] `components/shared/copy-button.tsx` - クリップボードコピーボタン（チェックマークアニメーション付き）
- [x] `components/shared/error-display.tsx` - エラー表示コンポーネント（スライドイン、行番号対応）
- [x] `app/page.tsx` - ホームページ（ツール一覧カード、アニメーション付き）

## Phase 3A: JSON 整形ツール

- [x] `lib/tools/json-utils.ts` - formatJSON, minifyJSON, validateJSON
- [x] `components/tools/json-formatter/json-syntax-display.tsx` - シンタックスハイライト付きJSON表示（Prism + oneDark、エラー行ハイライト）
- [x] `components/tools/json-formatter/json-diff-viewer.tsx` - 整形前後のフェード切り替え・変更行ハイライト
- [x] `components/tools/json-formatter/json-formatter-tool.tsx` - メインコンポーネント（左右パネル、整形/圧縮トグル、Ctrl+Enter）
- [x] `app/json-formatter/page.tsx` - JSON 整形ツールページ

## Phase 3B: Base64 エンコード/デコード

- [x] `lib/tools/base64-utils.ts` - encodeBase64, decodeBase64, isBase64
- [x] `components/tools/base64/character-flow-animation.tsx` - 文字が1文字ずつ流れるアニメーション
- [x] `components/tools/base64/base64-tool.tsx` - メインコンポーネント（自動判定バッジ、150msデバウンス、リアルタイム変換）
- [x] `app/base64/page.tsx` - Base64 ツールページ

## Phase 3C: JWT デコーダ

- [x] `lib/tools/jwt-utils.ts` - parseJWT (jose使用), getExpirationPercentage, isExpired, getFieldDescription
- [x] `components/tools/jwt-decoder/jwt-field-tooltip.tsx` - 標準フィールド説明ホバーツールチップ
- [x] `components/tools/jwt-decoder/jwt-expiration-bar.tsx` - 有効期限プログレスバー（緑→黄→赤、アニメーション）
- [x] `components/tools/jwt-decoder/jwt-card-section.tsx` - Header/Payload/Signature カード（展開/折りたたみ）
- [x] `components/tools/jwt-decoder/jwt-decoder-tool.tsx` - メインコンポーネント（ペースト自動解析、3カード表示）
- [x] `app/jwt-decoder/page.tsx` - JWT デコーダページ

## Phase 4: 仕上げ

- [x] レスポンシブデザイン調整（モバイル/タブレット/デスクトップ）
- [x] キーボードショートカット実装（Ctrl+Enter 等）
- [ ] ローディング状態の追加
- [x] 全体的なアニメーション調整・統一
- [x] `pnpm build` でビルドエラーがないことを確認

## Phase 5: chrome-devtools-mcp の設定

- [x] chrome-devtools-mcp の MCP サーバー設定を `.claude/settings.json` に追加
- [x] 開発サーバー起動状態で chrome-devtools-mcp の接続確認

## Phase 6: Agent Skill「browser-verify」の作成

- [x] `.claude/skills/browser-verify/SKILL.md` の作成
  - Skill の目的・概要を記述
  - chrome-devtools-mcp を使ったブラウザ自動操作の手順を定義
  - 検証対象の定義（各機能の正常系・異常系）
  - スクリーンショット保存先 (`docs/evidence/`) の指定
  - 検証レポート (`docs/evidence/REPORT.md`) の生成フォーマットを定義
- [x] `docs/evidence/` ディレクトリの作成
- [x] Skill の動作テスト（手動で `/browser-verify` を実行して確認）

### browser-verify 検証項目

#### サイドバー・ナビゲーション
- [x] 3ツール間のページ遷移が正常に動作すること
- [x] アクティブ状態のハイライトが正しく表示されること
- [x] モバイル幅でハンバーガーメニューが開閉すること

#### JSON 整形ツール
- [x] 有効なJSON入力 → 整形出力が正しいこと
- [x] 有効なJSON入力 → 圧縮出力が正しいこと
- [x] 不正なJSON入力 → 行番号付きエラーが表示されること
- [x] コピーボタンが動作すること

#### Base64 エンコード/デコード
- [x] テキスト入力 → エンコード結果が正しいこと
- [x] Base64文字列入力 → 自動判定でデコードされること
- [x] 不正なBase64入力 → エラーが表示されること
- [x] リアルタイム変換が動作すること

#### JWT デコーダ
- [x] 有効なJWT入力 → Header/Payload/Signature の3セクションが展開されること
- [x] 有効期限バーが正しく表示されること（有効/期限切れ）
- [x] フィールドホバーで説明ツールチップが表示されること
- [x] 不正なJWT入力 → エラーが表示されること

## Phase 7: 自動検証の実行

- [x] 開発サーバーを起動
- [x] `/browser-verify` を実行して全機能を自動検証
- [x] `docs/evidence/REPORT.md` の検証レポートを確認
- [x] 不具合があれば修正して再検証
