"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolPanel } from "@/components/shared/tool-panel";
import { CopyButton } from "@/components/shared/copy-button";
import { ErrorDisplay } from "@/components/shared/error-display";
import { JsonSyntaxDisplay } from "@/components/tools/json-formatter/json-syntax-display";
import { JsonDiffViewer } from "@/components/tools/json-formatter/json-diff-viewer";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatJSON, minifyJSON } from "@/lib/tools/json-utils";
import { fadeIn } from "@/lib/animations";

type Mode = "format" | "minify";

const PLACEHOLDER = '{\n  "name": "example",\n  "value": 42\n}';

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [previousOutput, setPreviousOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("format");
  const [hasExecuted, setHasExecuted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const execute = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setPreviousOutput("");
      setError(null);
      setErrorLine(null);
      setHasExecuted(false);
      return;
    }

    if (mode === "format") {
      const result = formatJSON(input);
      if (result.error) {
        setError(result.error);
        setErrorLine(result.errorLine);
        setOutput("");
        setPreviousOutput("");
      } else {
        setError(null);
        setErrorLine(null);
        setPreviousOutput(output);
        setOutput(result.formatted ?? "");
      }
    } else {
      const result = minifyJSON(input);
      if (result.error) {
        setError(result.error);
        setErrorLine(null);
        setOutput("");
        setPreviousOutput("");
      } else {
        setError(null);
        setErrorLine(null);
        setPreviousOutput(output);
        setOutput(result.minified ?? "");
      }
    }
    setHasExecuted(true);
  }, [input, mode, output]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        execute();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [execute]);

  const handleModeChange = (value: string) => {
    setMode(value as Mode);
  };

  const showDiff = hasExecuted && previousOutput && previousOutput !== output;

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <div className="mb-6 flex items-center justify-between">
        <Tabs value={mode} onValueChange={handleModeChange}>
          <TabsList>
            <TabsTrigger value="format">整形</TabsTrigger>
            <TabsTrigger value="minify">圧縮</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-muted-foreground text-sm">
          <kbd className="bg-muted rounded px-1.5 py-0.5 text-xs font-mono">
            Ctrl+Enter
          </kbd>{" "}
          で実行
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ErrorDisplay message={error} line={errorLine ?? undefined} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-2">
        <ToolPanel title="Input">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDER}
            className="min-h-[500px] font-mono text-sm resize-none"
            spellCheck={false}
          />
        </ToolPanel>

        <ToolPanel
          title="Output"
          actions={output ? <CopyButton text={output} /> : undefined}
        >
          {output ? (
            showDiff ? (
              <JsonDiffViewer before={previousOutput} after={output} />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={output}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <JsonSyntaxDisplay code={output} errorLine={errorLine ?? undefined} />
                </motion.div>
              </AnimatePresence>
            )
          ) : (
            <div className="flex h-[500px] items-center justify-center">
              <p className="text-muted-foreground text-sm">
                {input.trim()
                  ? "Ctrl+Enter で実行してください"
                  : "左のパネルにJSONを入力してください"}
              </p>
            </div>
          )}
        </ToolPanel>
      </div>
    </motion.div>
  );
}
