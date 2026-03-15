"use client";

import { motion } from "framer-motion";
import { Wifi, Clock, Zap, Globe, ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";

export interface Product {
  id: string | number;
  name: string;
  nameEn?: string;
  type: "local" | "regional" | "global";
  countries: Array<{
    cn: string;
    en: string;
    code: string;
  }>;
  dataSize: number; // MB
  validDays: number;
  price: number;
  agentPrice?: number;
  stock: number;
  status: string;
  isHot?: boolean;
  isRecommend?: boolean;
  image?: string;
  features?: string[];
}

interface ProductCardProps {
  product: Product;
  onBuy?: (product: Product) => void;
}

// Format data size (MB -> GB/MB display)
function formatDataSize(mb: number): string {
  if (mb >= 1024) {
    const gb = mb / 1024;
    return gb % 1 === 0 ? `${gb}GB` : `${gb.toFixed(1)}GB`;
  }
  return `${mb}MB`;
}

// Get flag emoji from country code
function getFlagEmoji(code: string): string {
  const flags: Record<string, string> = {
    JP: "🇯🇵", KR: "🇰🇷", TH: "🇹🇭", US: "🇺🇸", AU: "🇦🇺",
    GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", IT: "🇮🇹", ES: "🇪🇸",
    SG: "🇸🇬", MY: "🇲🇾", ID: "🇮🇩", VN: "🇻🇳", PH: "🇵🇭",
    CN: "🇨🇳", HK: "🇭🇰", TW: "🇹🇼", MO: "🇲🇴",
    // Add more as needed
  };
  return flags[code] || "🌍";
}

// Get region name from country
function getRegion(countryCode: string): string {
  const regions: Record<string, string> = {
    JP: "亚洲", KR: "亚洲", TH: "东南亚", SG: "东南亚", MY: "东南亚",
    ID: "东南亚", VN: "东南亚", PH: "东南亚", CN: "亚洲", HK: "亚洲",
    TW: "亚洲", US: "北美", CA: "北美", GB: "欧洲", DE: "欧洲",
    FR: "欧洲", IT: "欧洲", ES: "欧洲", AU: "大洋洲",
  };
  return regions[countryCode] || "全球";
}

// Get type label
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    local: "本地套餐",
    regional: "区域套餐",
    global: "全球套餐",
  };
  return labels[type] || "套餐";
}

export default function ProductCard({ product, onBuy }: ProductCardProps) {
  const country = product.countries?.[0];
  const countryName = country?.cn || "全球";
  const countryCode = country?.code || "GL";
  const flag = getFlagEmoji(countryCode);
  const region = getRegion(countryCode);
  const dataAmount = formatDataSize(product.dataSize);
  const duration = `${product.validDays}天`;
  const isAvailable = product.status === "active" && product.stock > 0;
  const isPopular = product.isHot || product.isRecommend;

  const handleBuy = () => {
    if (onBuy && isAvailable) {
      onBuy(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`product-card-touch relative flex flex-col rounded-2xl border bg-white p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-lg active:shadow-md ${
        isPopular
          ? "border-brand-500 ring-2 ring-brand-500/20"
          : "border-gray-200"
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white">
          🔥 热门
        </span>
      )}

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">{flag}</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{countryName}</h3>
          <p className="text-sm text-gray-500">{region} · {getTypeLabel(product.type)}</p>
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

      {/* Stock indicator */}
      {product.stock < 100 && (
        <div className="mb-2 text-xs text-orange-600">
          库存紧张：仅剩 {product.stock} 件
        </div>
      )}

      {/* Price & CTA */}
      <div className="border-t border-gray-100 pt-4">
        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-sm text-gray-500">$</span>
          <span className="text-3xl font-extrabold text-brand-700">
            {product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-400">起</span>
        </div>
        <Button
          onClick={handleBuy}
          disabled={!isAvailable}
          variant={isPopular ? "primary" : "outline"}
          className="w-full"
          icon={<ShoppingCart className="h-4 w-4" />}
        >
          {isAvailable ? "立即购买" : "暂时缺货"}
        </Button>
      </div>
    </motion.div>
  );
}
