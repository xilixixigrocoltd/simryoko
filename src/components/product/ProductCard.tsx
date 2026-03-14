"use client";

import { motion } from "framer-motion";
import { Globe, Wifi, Clock, Zap } from "lucide-react";
import Button from "@/components/ui/Button";

export interface Product {
  id: string;
  region: string;
  country: string;
  flag: string;
  dataAmount: string;
  duration: string;
  price: number;
  currency?: string;
  popular?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const { region, country, flag, dataAmount, duration, price, currency = "$", popular } = product;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-lg ${
        popular ? "border-brand-500 ring-2 ring-brand-500/20" : "border-gray-200"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white">
          🔥 热门
        </span>
      )}

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">{flag}</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{country}</h3>
          <p className="text-sm text-gray-500">{region}</p>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6 flex-1 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Wifi className="h-4 w-4 text-brand-500" />
          <span>{dataAmount} 流量</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-brand-500" />
          <span>{duration} 有效期</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Zap className="h-4 w-4 text-brand-500" />
          <span>即买即用 · 无需换卡</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Globe className="h-4 w-4 text-brand-500" />
          <span>支持热点共享</span>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="border-t border-gray-100 pt-4">
        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-sm text-gray-500">{currency}</span>
          <span className="text-3xl font-extrabold text-brand-700">{price}</span>
          <span className="text-sm text-gray-400">起</span>
        </div>
        <Button variant={popular ? "primary" : "outline"} size="md" className="w-full">
          立即购买
        </Button>
      </div>
    </motion.div>
  );
}
