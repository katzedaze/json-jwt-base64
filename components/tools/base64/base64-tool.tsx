"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolPanel } from "@/components/shared/tool-panel";
import { CopyButton } from "@/components/shared/copy-button";
import { ErrorDisplay } from "@/components/shared/error-display";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CharacterFlowAnimation } from "@/components/tools/base64/character-flow-animation";
import { encodeBase64, decodeBase64, isBase64 } from "@/lib/tools/base64-utils";
import { fadeIn } from "@/lib/animations";

const DEBOUNCE_MS = 150;

export function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      setMode("encode");
      return;
    }

    const timer = setTimeout(() => {
      const detectedMode = isBase64(input.trim()) ? "decode" : "encode";
      setMode(detectedMode);

      if (detectedMode === "encode") {
        setOutput(encodeBase64(input));
        setError(null);
      } else {
        const { decoded, error: decodeError } = decodeBase64(input.trim());
        if (decodeError) {
          setError(decodeError);
          setOutput("");
        } else {
          setOutput(decoded!);
          setError(null);
        }
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-bold">Base64</h1>
        <AnimatePresence mode="wait">
          {input.trim() && (
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Badge variant={mode === "encode" ? "default" : "secondary"}>
                {mode === "encode" ? "Encode" : "Decode"}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ToolPanel title="Input">
          <Textarea
            placeholder="テキストまたはBase64文字列を入力..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[300px] resize-y font-mono"
          />
        </ToolPanel>

        <ToolPanel
          title="Output"
          actions={output ? <CopyButton text={output} /> : undefined}
        >
          <div className="min-h-[300px] rounded-md border bg-muted/50 p-3">
            {error ? (
              <ErrorDisplay message={error} />
            ) : output ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={output}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                >
                  <CharacterFlowAnimation text={output} direction={mode} />
                </motion.div>
              </AnimatePresence>
            ) : (
              <span className="text-muted-foreground">
                入力すると自動的に変換されます
              </span>
            )}
          </div>
        </ToolPanel>
      </div>
    </div>
  );
}
