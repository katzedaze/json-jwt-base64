"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  getExpirationPercentage,
  isExpired,
  formatTimestamp,
} from "@/lib/tools/jwt-utils";

interface JwtExpirationBarProps {
  iat?: number;
  exp?: number;
}

function getBarColor(percentage: number): string {
  if (percentage >= 100) return "bg-red-500";
  if (percentage >= 80) return "bg-orange-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-green-500";
}

export function JwtExpirationBar({ iat, exp }: JwtExpirationBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  const percentage = exp != null ? getExpirationPercentage(iat, exp) : 0;
  const expired = exp != null ? isExpired(exp) : false;

  useEffect(() => {
    if (exp == null) return;
    const timer = requestAnimationFrame(() => {
      setAnimatedValue(percentage);
    });
    return () => cancelAnimationFrame(timer);
  }, [percentage, exp]);

  if (exp == null) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <p className="text-sm text-muted-foreground">有効期限なし</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">有効期限</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(exp)}
          </span>
          {expired && (
            <Badge variant="destructive" className="text-xs">
              期限切れ
            </Badge>
          )}
        </div>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
        <motion.div
          className={`h-full rounded-full ${getBarColor(percentage)}`}
          initial={{ width: "0%" }}
          animate={{ width: `${animatedValue}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
