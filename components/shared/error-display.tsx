"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { slideUp } from "@/lib/animations";

interface ErrorDisplayProps {
  message: string;
  line?: number;
}

export function ErrorDisplay({ message, line }: ErrorDisplayProps) {
  return (
    <AnimatePresence>
      <motion.div variants={slideUp} initial="hidden" animate="visible" exit="hidden">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {line !== undefined && <span className="font-semibold">行 {line}: </span>}
            {message}
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
