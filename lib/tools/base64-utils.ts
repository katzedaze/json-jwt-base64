export function encodeBase64(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

export function decodeBase64(input: string): {
  decoded: string | null;
  error: string | null;
} {
  try {
    const decoded = decodeURIComponent(escape(atob(input)));
    return { decoded, error: null };
  } catch {
    return { decoded: null, error: "無効なBase64文字列です" };
  }
}

export function isBase64(input: string): boolean {
  if (input.length < 4) return false;
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) return false;

  try {
    atob(input);
    return true;
  } catch {
    return false;
  }
}
