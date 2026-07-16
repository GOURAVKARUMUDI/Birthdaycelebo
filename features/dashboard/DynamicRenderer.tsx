"use client";

import React from "react";
import { BlockRenderer } from "@/components/builder/registry";
import { BlockConfig } from "@/lib/store/editorStore";

export type { BlockConfig };

interface DynamicRendererProps {
  block: any;
  recipientName: string;
  fallbackData: any;
}

export default function DynamicRenderer({ block, recipientName, fallbackData }: DynamicRendererProps) {
  return (
    <BlockRenderer
      block={block}
      recipientName={recipientName}
      fallbackData={fallbackData}
    />
  );
}
