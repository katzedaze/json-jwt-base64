import { decodeProtectedHeader, decodeJwt } from "jose";

export interface JWTParseResult {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string | null;
  error: string | null;
}

export function parseJWT(token: string): JWTParseResult {
  const trimmed = token.trim();
  if (!trimmed) {
    return { header: null, payload: null, signature: null, error: null };
  }

  try {
    const header = decodeProtectedHeader(trimmed) as Record<string, unknown>;
    const payload = decodeJwt(trimmed) as Record<string, unknown>;
    const parts = trimmed.split(".");
    const signature = parts.length >= 3 ? parts[2] : null;

    return { header, payload, signature, error: null };
  } catch {
    return {
      header: null,
      payload: null,
      signature: null,
      error: "無効なJWTトークンです。正しい形式か確認してください。",
    };
  }
}

export function getExpirationPercentage(iat: number | undefined, exp: number): number {
  const now = Math.floor(Date.now() / 1000);

  if (now >= exp) {
    return 100;
  }

  const effectiveIat = iat ?? exp - 86400;
  const total = exp - effectiveIat;

  if (total <= 0) {
    return 100;
  }

  const elapsed = now - effectiveIat;
  const percentage = (elapsed / total) * 100;

  return Math.max(0, Math.min(100, percentage));
}

export function isExpired(exp: number): boolean {
  return Math.floor(Date.now() / 1000) >= exp;
}

const FIELD_DESCRIPTIONS: Record<string, string> = {
  iss: "発行者 (Issuer)",
  sub: "主題 (Subject)",
  aud: "対象者 (Audience)",
  exp: "有効期限 (Expiration Time)",
  nbf: "有効開始日時 (Not Before)",
  iat: "発行日時 (Issued At)",
  jti: "JWT ID",
  typ: "トークンタイプ",
  alg: "署名アルゴリズム",
};

export function getFieldDescription(field: string): string {
  return FIELD_DESCRIPTIONS[field] ?? "カスタムフィールド";
}

export function formatTimestamp(value: number): string {
  const date = new Date(value * 1000);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}
