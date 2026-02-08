"use client";

import type { ReactNode } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { getFieldDescription } from "@/lib/tools/jwt-utils";

interface JwtFieldTooltipProps {
  field: string;
  children: ReactNode;
}

export function JwtFieldTooltip({ field, children }: JwtFieldTooltipProps) {
  const description = getFieldDescription(field);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top" sideOffset={4}>
          <p className="font-semibold">{field}</p>
          <p className="text-xs opacity-80">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
