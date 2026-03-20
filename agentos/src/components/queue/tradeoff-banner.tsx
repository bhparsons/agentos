"use client";

import { AlertTriangle } from "lucide-react";

interface TradeoffBannerProps {
  message: string;
}

export function TradeoffBanner({ message }: TradeoffBannerProps) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
      <div>
        <p className="font-medium text-amber-800 dark:text-amber-200">Tradeoff Warning</p>
        <p className="text-amber-700 dark:text-amber-300 text-xs mt-0.5">{message}</p>
      </div>
    </div>
  );
}
