"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ToolPanel } from "@/components/shared/tool-panel";
import { CopyButton } from "@/components/shared/copy-button";
import { ErrorDisplay } from "@/components/shared/error-display";
import { JwtCardSection } from "@/components/tools/jwt-decoder/jwt-card-section";
import { JwtExpirationBar } from "@/components/tools/jwt-decoder/jwt-expiration-bar";
import { Textarea } from "@/components/ui/textarea";
import { parseJWT } from "@/lib/tools/jwt-utils";
import type { JWTParseResult } from "@/lib/tools/jwt-utils";
import { staggerContainer, slideUp } from "@/lib/animations";

export function JwtDecoderTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JWTParseResult>({
    header: null,
    payload: null,
    signature: null,
    error: null,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const decode = useCallback((token: string) => {
    setResult(parseJWT(token));
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInput(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        decode(value);
      }, 300);
    },
    [decode]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pasted = e.clipboardData.getData("text");
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      setTimeout(() => {
        decode(pasted);
      }, 0);
    },
    [decode]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const hasResult = result.header || result.payload || result.signature;
  const payload = result.payload as Record<string, unknown> | null;
  const exp = payload?.exp as number | undefined;
  const iat = payload?.iat as number | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">JWT Decoder</h1>
        <p className="text-muted-foreground">
          JWTトークンを貼り付けると自動的に解析します
        </p>
      </div>

      <ToolPanel title="JWT Token" actions={<CopyButton text={input} />}>
        <Textarea
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          value={input}
          onChange={handleChange}
          onPaste={handlePaste}
          className="min-h-[120px] font-mono text-sm resize-none"
        />
      </ToolPanel>

      {result.error && <ErrorDisplay message={result.error} />}

      {!hasResult && !result.error && (
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="rounded-lg border border-dashed border-border p-8 text-center"
        >
          <p className="text-muted-foreground">
            JWTトークンを入力すると、Header・Payload・Signatureに分解して表示します。
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            すべての処理はブラウザ上で完結します。サーバーへのデータ送信は一切行いません。
          </p>
        </motion.div>
      )}

      {hasResult && (
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={slideUp}>
            <JwtCardSection
              title="Header"
              data={result.header}
              color="blue"
              defaultOpen
            />
          </motion.div>

          <motion.div variants={slideUp}>
            <JwtCardSection
              title="Payload"
              data={result.payload}
              color="green"
              defaultOpen
            />
          </motion.div>

          {exp != null && (
            <motion.div variants={slideUp}>
              <JwtExpirationBar iat={iat} exp={exp} />
            </motion.div>
          )}

          <motion.div variants={slideUp}>
            <JwtCardSection
              title="Signature"
              data={result.signature ? { value: result.signature } : null}
              color="orange"
              defaultOpen={false}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
