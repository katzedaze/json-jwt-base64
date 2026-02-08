# セッション3: JWT デコーダ

## 概要

JWT Decoder（トークン解析・有効期限表示・フィールド説明）機能を実装する。
`feature/jwt-decoder` ブランチで作業し、完了後にコミットする。

## 作業ディレクトリ

```
/home/katzedaze/workspace/worktree-jwt
```

このディレクトリは main ブランチから作成された git worktree である。

## 前提

- CLAUDE.md を読んでプロジェクト方針を把握すること
- セッション0（main ブランチ）の作業が完了済みであること
- 共通コンポーネント（ToolPanel, CopyButton, ErrorDisplay）は実装済み
- `lib/animations.ts` の共通バリアントは定義済み

## ブランチ

```
feature/jwt-decoder
```

## 触れてよいファイル（このセッションの担当範囲）

```
lib/tools/jwt-utils.ts                                   # 新規作成
components/tools/jwt-decoder/jwt-field-tooltip.tsx           # 新規作成
components/tools/jwt-decoder/jwt-expiration-bar.tsx          # 新規作成
components/tools/jwt-decoder/jwt-card-section.tsx            # 新規作成
components/tools/jwt-decoder/jwt-decoder-tool.tsx            # 新規作成
app/jwt-decoder/page.tsx                                  # 新規作成
```

## 触れてはいけないファイル

以下は他セッションの担当であり、絶対に変更しない:
- `components/tools/json-formatter/` 配下すべて
- `components/tools/base64/` 配下すべて
- `lib/tools/json-utils.ts`
- `lib/tools/base64-utils.ts`
- `app/json-formatter/`
- `app/base64/`
- `components/layout/` 配下（共通レイアウトはセッション0で確定済み）
- `components/shared/` 配下（共通コンポーネントはセッション0で確定済み）
- `components/ui/` 配下（Shadcn 自動生成）
- `lib/animations.ts`（共通バリアントはセッション0で確定済み）

## 作業内容

### 1. `lib/tools/jwt-utils.ts`

純粋関数のみ。React 非依存。jose ライブラリを使用。

```ts
interface JWTParseResult {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string | null;
  error: string | null;
}

parseJWT(token: string): JWTParseResult
```
- jose の `decodeProtectedHeader()` でヘッダー取得
- jose の `decodeJwt()` でペイロード取得
- トークンの3番目のパートをシグネチャとして抽出
- 不正なトークンの場合はエラーを返す

```ts
getExpirationPercentage(iat: number, exp: number): number
```
- `iat` (発行時刻) から `exp` (有効期限) までの経過割合を 0-100 で返す
- 現在時刻が `exp` を超えている場合は 100 を返す
- `iat` が存在しない場合は `exp` の24時間前を仮の `iat` とする

```ts
isExpired(exp: number): boolean
```
- 現在時刻と `exp` を比較

```ts
getFieldDescription(field: string): string
```
- 標準 JWT フィールドの説明を日本語で返す:
  - `iss` → 発行者 (Issuer)
  - `sub` → 主題 (Subject)
  - `aud` → 対象者 (Audience)
  - `exp` → 有効期限 (Expiration Time)
  - `nbf` → 有効開始日時 (Not Before)
  - `iat` → 発行日時 (Issued At)
  - `jti` → JWT ID
  - `typ` → トークンタイプ
  - `alg` → 署名アルゴリズム
- 未知のフィールドは「カスタムフィールド」を返す

### 2. `components/tools/jwt-decoder/jwt-field-tooltip.tsx`

- `"use client"` 必須
- Props: `field: string`, `children: ReactNode`
- Shadcn Tooltip ラッパー
- ホバーで `getFieldDescription(field)` の内容をツールチップ表示
- フィールド名と説明を表示

### 3. `components/tools/jwt-decoder/jwt-expiration-bar.tsx`

- `"use client"` 必須
- Props: `iat?: number`, `exp?: number`
- Shadcn Progress コンポーネントをカスタマイズ
- 経過割合に応じたスタイル:
  - 0-50%: 緑 (bg-green-500)
  - 50-80%: 黄 (bg-yellow-500)
  - 80-99%: オレンジ (bg-orange-500)
  - 100% (期限切れ): 赤 (bg-red-500) + 「期限切れ」ラベル
- exp の日時をフォーマットして表示（例: "2025-12-31 23:59:59"）
- マウント時に Framer Motion で 0% → 現在値まで伸びるアニメーション
- `exp` が存在しない場合は「有効期限なし」と表示

### 4. `components/tools/jwt-decoder/jwt-card-section.tsx`

- `"use client"` 必須
- Props: `title: string`, `data: Record<string, unknown> | null`, `color: string`, `defaultOpen?: boolean`
- Shadcn Card ベース
- Framer Motion で展開/折りたたみアニメーション (`AnimatePresence` + `motion.div` で height auto アニメーション)
- ヘッダークリックで開閉トグル
- 展開時: JSON のキー・バリューを一覧表示
- 各フィールドを `JwtFieldTooltip` で囲む
- `color` に応じたアクセントカラー（Header: blue, Payload: green, Signature: orange）
- `exp`, `iat`, `nbf` の値は Unix タイムスタンプを人間可読な日時に変換して表示

### 5. `components/tools/jwt-decoder/jwt-decoder-tool.tsx`

- `"use client"` 必須
- メインのツールコンポーネント。ページから呼ばれる唯一のコンポーネント。
- レイアウト:
  - 上部: 入力 `<textarea>` を ToolPanel で囲む（CopyButton 付き）
  - 下部: 3 つの JwtCardSection を縦に配置
    1. Header（デフォルト展開、blue アクセント）
    2. Payload（デフォルト展開、green アクセント）
    3. Signature（デフォルト折りたたみ、orange アクセント）
  - Payload セクションの下に JwtExpirationBar
- 自動解析:
  - テキストエリアの `onChange` および `onPaste` で `parseJWT()` を呼ぶ
  - ペースト時は即座に解析（デバウンスなし）
  - 入力変更時は 300ms デバウンス
- エラー時: ErrorDisplay を表示
- 入力が空の場合はプレースホルダーテキストとサンプル JWT の説明を表示
- Framer Motion で staggerContainer を使い、カードが順番に表示される演出

### 6. `app/jwt-decoder/page.tsx`

- JwtDecoderTool をインポートして表示するだけ
- `export default function JwtDecoderPage()`
- ロジックは持たない

### 7. 動作確認

```bash
pnpm build
```

ビルドが通ることを確認する。

テスト用 JWT（以下を使って手動テスト可能）:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 8. コミット

```bash
git add -A
git commit -m "feat: JWTデコーダ実装（トークン解析・有効期限バー・フィールドツールチップ）"
```

## 完了条件

- [ ] `pnpm build` がエラーなく通る
- [ ] `/jwt-decoder` にアクセスして入力エリアと空のカードエリアが表示される
- [ ] 有効な JWT を入力 → Header / Payload / Signature の3カードが展開される
- [ ] Payload に exp/iat がある場合、有効期限バーが表示される
- [ ] 有効期限バーの色が経過割合に応じて変化する
- [ ] 各フィールドにホバーすると説明ツールチップが表示される
- [ ] exp/iat/nbf の値が人間可読な日時に変換されている
- [ ] 不正な JWT を入力 → エラーが表示される
- [ ] カードの展開/折りたたみアニメーションが動作する
- [ ] コピーボタンが動作する
- [ ] `feature/jwt-decoder` ブランチにコミット済み
