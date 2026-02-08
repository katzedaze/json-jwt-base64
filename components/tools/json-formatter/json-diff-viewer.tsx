"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JsonDiffViewerProps {
  before: string;
  after: string;
}

function computeChangedLines(before: string, after: string): Set<number> {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const changed = new Set<number>();

  for (let i = 0; i < afterLines.length; i++) {
    if (i >= beforeLines.length || beforeLines[i] !== afterLines[i]) {
      changed.add(i + 1);
    }
  }

  return changed;
}

export function JsonDiffViewer({ before, after }: JsonDiffViewerProps) {
  const changedLines = useMemo(
    () => computeChangedLines(before, after),
    [before, after]
  );

  return (
    <ScrollArea className="h-[500px] w-full rounded-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={after}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SyntaxHighlighter
            language="json"
            style={oneDark}
            showLineNumbers={true}
            wrapLines={true}
            lineProps={(lineNumber) => {
              const style: React.CSSProperties = { display: "block" };
              if (changedLines.has(lineNumber)) {
                style.backgroundColor = "rgba(34, 197, 94, 0.1)";
                style.borderLeft = "3px solid rgba(34, 197, 94, 0.5)";
                style.paddingLeft = "0.5rem";
              }
              return { style };
            }}
            customStyle={{
              margin: 0,
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              background: "transparent",
            }}
          >
            {after}
          </SyntaxHighlighter>
        </motion.div>
      </AnimatePresence>
    </ScrollArea>
  );
}
