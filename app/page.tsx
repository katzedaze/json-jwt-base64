"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Braces, ArrowLeftRight, Key } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { staggerContainer, cardExpand } from "@/lib/animations";

const tools = [
  {
    href: "/json-formatter",
    title: "JSON Formatter",
    description: "JSON整形・圧縮・バリデーション",
    icon: Braces,
  },
  {
    href: "/base64",
    title: "Base64",
    description: "Base64エンコード・デコード（自動判定付き）",
    icon: ArrowLeftRight,
  },
  {
    href: "/jwt-decoder",
    title: "JWT Decoder",
    description: "JWTトークンの解析・有効期限表示",
    icon: Key,
  },
];

export default function Home() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Web Toolbox</h1>
      <p className="mb-8 text-muted-foreground">
        エンジニアが日常的に使うツールをまとめました
      </p>
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {tools.map((tool) => (
          <motion.div key={tool.href} variants={cardExpand}>
            <Link href={tool.href}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
