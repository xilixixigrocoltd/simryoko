"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Shield, Check } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  dataAmount: number | null;
  validityDays: number;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  
  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"info" | "payment" | "success">("info");

  useEffect(() => {
    if (productId) {
      fetch(`/api/products?id=${productId}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.data?.list?.[0]) {
            setProduct(data.data.list[0]);
          } else {
            setError("产品不存在");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("加载失败");
          setLoading(false);
        });
    } else {
      setError("请选择产品");
      setLoading(false);
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      setError("邮箱不一致");
      return;
    }
    setStep("payment");
    
    // Call checkout API
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: Number(productId), email }),
    });
    const data = await res.json();
    
    if (data.url) {
      window.location.href = data.url;
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">加载中...</div>;
  if (error) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-red-400">{error}</div>;
  if (!product) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> 返回
        </Link>

        <h1 className="text-2xl font-bold mb-8">结算</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">订单摘要</h2>
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-gray-400">{product.name}</span>
              <span className="font-medium">${product.price}</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold">
              <span>总计</span>
              <span className="text-blue-400">${product.price}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            {step === "info" && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-lg font-semibold mb-4">联系信息</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">邮箱</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">确认邮箱</label>
                    <input
                      type="email"
                      required
                      value={confirmEmail}
                      onChange={e => setConfirmEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    前往支付
                  </button>
                </div>
              </form>
            )}

            {step === "payment" && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p>正在跳转到 Stripe 安全支付...</p>
              </div>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> SSL 加密</span>
          <span className="flex items-center gap-1"><Check className="w-4 h-4" /> 即时交付</span>
        </div>
      </div>
    </main>
  );
}
