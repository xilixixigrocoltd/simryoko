"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  dataAmount: number | null;
  validityDays: number;
  type: string;
}

export default function ProductList({ countryCode }: { countryCode: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?country=${countryCode}&page=1&pageSize=20`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data.list);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [countryCode]);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">加载产品中...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-12 text-gray-400">暂无产品</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-sm text-gray-400 mb-2">
            {product.dataAmount ? `${product.dataAmount}MB` : "无限流量"} · {product.validityDays}天
          </p>
          <p className="text-2xl font-bold text-blue-400 mb-4">${product.price}</p>
          <Link href={`/checkout?productId=${product.id}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full justify-center">
            立即购买 <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      ))}
    </div>
  );
}
