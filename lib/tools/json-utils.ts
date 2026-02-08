interface FormatResult {
  formatted: string | null;
  error: string | null;
  errorLine: number | null;
}

interface MinifyResult {
  minified: string | null;
  error: string | null;
}

interface ValidateResult {
  valid: boolean;
  error: string | null;
  errorLine: number | null;
}

function extractErrorLine(errorMessage: string, input: string): number | null {
  // Try to extract position from JSON.parse error message
  const positionMatch = errorMessage.match(/position\s+(\d+)/i);
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const beforeError = input.substring(0, position);
    return beforeError.split("\n").length;
  }

  const lineMatch = errorMessage.match(/line\s+(\d+)/i);
  if (lineMatch) {
    return parseInt(lineMatch[1], 10);
  }

  return null;
}

export function formatJSON(input: string): FormatResult {
  if (!input.trim()) {
    return { formatted: null, error: null, errorLine: null };
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    return { formatted, error: null, errorLine: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid JSON";
    const errorLine = extractErrorLine(message, input);
    return { formatted: null, error: message, errorLine };
  }
}

export function minifyJSON(input: string): MinifyResult {
  if (!input.trim()) {
    return { minified: null, error: null };
  }

  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    return { minified, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid JSON";
    return { minified: null, error: message };
  }
}

export function validateJSON(input: string): ValidateResult {
  if (!input.trim()) {
    return { valid: false, error: null, errorLine: null };
  }

  try {
    JSON.parse(input);
    return { valid: true, error: null, errorLine: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid JSON";
    const errorLine = extractErrorLine(message, input);
    return { valid: false, error: message, errorLine };
  }
}

export type { FormatResult, MinifyResult, ValidateResult };
