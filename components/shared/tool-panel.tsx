"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeIn } from "@/lib/animations";

interface ToolPanelProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function ToolPanel({ title, children, actions }: ToolPanelProps) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
