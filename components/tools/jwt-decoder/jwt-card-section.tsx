"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { JwtFieldTooltip } from "@/components/tools/jwt-decoder/jwt-field-tooltip";
import { formatTimestamp } from "@/lib/tools/jwt-utils";
import { cn } from "@/lib/utils";

interface JwtCardSectionProps {
  title: string;
  data: Record<string, unknown> | null;
  color: string;
  defaultOpen?: boolean;
}

const TIMESTAMP_FIELDS = new Set(["exp", "iat", "nbf"]);

const COLOR_MAP: Record<string, { border: string; text: string; bg: string }> = {
  blue: {
    border: "border-blue-500/30",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  green: {
    border: "border-green-500/30",
    text: "text-green-400",
    bg: "bg-green-500/10",
  },
  orange: {
    border: "border-orange-500/30",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
  },
};

function formatValue(key: string, value: unknown): string {
  if (TIMESTAMP_FIELDS.has(key) && typeof value === "number") {
    return `${value} (${formatTimestamp(value)})`;
  }
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

export function JwtCardSection({
  title,
  data,
  color,
  defaultOpen = true,
}: JwtCardSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const colors = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <Card className={cn("overflow-hidden border", colors.border)}>
      <CardHeader
        className="cursor-pointer select-none py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className={cn("text-base font-semibold", colors.text)}>
            {title}
          </CardTitle>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className={cn("h-4 w-4", colors.text)} />
          </motion.div>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {isOpen && data && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CardContent className="pt-0 pb-4">
              <div className={cn("rounded-md p-3 space-y-1.5", colors.bg)}>
                {Object.entries(data).map(([key, value]) => (
                  <JwtFieldTooltip key={key} field={key}>
                    <div className="flex gap-2 text-sm font-mono cursor-help">
                      <span className={cn("font-semibold shrink-0", colors.text)}>
                        {key}:
                      </span>
                      <span className="text-foreground/80 break-all">
                        {formatValue(key, value)}
                      </span>
                    </div>
                  </JwtFieldTooltip>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
