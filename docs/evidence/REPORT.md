# Browser Verify 検証レポート

実行日時: 2026-02-08 01:08

## サマリー

| カテゴリ | 合格 | 不合格 | 合計 |
|---------|------|--------|------|
| サイドバー・ナビゲーション | 8 | 0 | 8 |
| JSON 整形ツール | 4 | 0 | 4 |
| Base64 エンコード/デコード | 4 | 0 | 4 |
| JWT デコーダ | 4 | 0 | 4 |
| **合計** | **20** | **0** | **20** |

## 詳細結果

### サイドバー・ナビゲーション

| # | テスト項目 | 結果 | 備考 |
|---|----------|------|------|
| 0 | Home page loads | PASS | - |
| 1-1 | Home page displayed | PASS | - |
| 1-1 | Navigate to JSON Formatter | PASS | - |
| 1-1 | Navigate to Base64 | PASS | - |
| 1-1 | Navigate to JWT Decoder | PASS | - |
| 1-2 | Active state highlight | PASS | Active: JWT Decoder |
| 1-3 | Sidebar hidden on mobile | PASS | - |
| 1-3 | Mobile menu opens | PASS | - |

### JSON 整形ツール

| # | テスト項目 | 結果 | 備考 |
|---|----------|------|------|
| 2-1 | JSON format output | PASS | - |
| 2-2 | JSON minify output | PASS | - |
| 2-3 | JSON validation error shown | PASS | - |
| 2-4 | Copy button clicked | PASS | - |

### Base64 エンコード/デコード

| # | テスト項目 | 結果 | 備考 |
|---|----------|------|------|
| 3-1 | Base64 encode output | PASS | Output: SGVsbG8sIFdvcmxkIQ== |
| 3-2 | Base64 decode output | PASS | Output: Hello, World! |
| 3-3 | Invalid base64 handling | PASS | Result: output-present |
| 3-4 | Realtime conversion | PASS | "A"→"QQ==", "AB"→"QUI=" |

### JWT デコーダ

| # | テスト項目 | 結果 | 備考 |
|---|----------|------|------|
| 4-1 | JWT Header/Payload displayed | PASS | alg:true sub:true name:true |
| 4-2 | Expiration bar shows expired | PASS | - |
| 4-3 | Field tooltip available | PASS | sub field found |
| 4-4 | Invalid JWT error shown | PASS | - |
