"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JsonSyntaxDisplayProps {
  code: string;
  errorLine?: number;
}

export function JsonSyntaxDisplay({ code, errorLine }: JsonSyntaxDisplayProps) {
  return (
    <ScrollArea className="h-[500px] w-full rounded-md">
      <SyntaxHighlighter
        language="json"
        style={oneDark}
        showLineNumbers={true}
        wrapLines={true}
        lineProps={(lineNumber) => {
          const style: React.CSSProperties = { display: "block" };
          if (errorLine !== undefined && lineNumber === errorLine) {
            style.backgroundColor = "rgba(127, 29, 29, 0.3)";
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
        {code}
      </SyntaxHighlighter>
    </ScrollArea>
  );
}
