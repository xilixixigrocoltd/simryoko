'use client';

import { useState } from 'react';
import PurchaseNoticeModal from './PurchaseNoticeModal';
import PaymentForm from './PaymentForm';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
}

export default function CheckoutPage({ cartItems }: CheckoutPageProps) {
  const [showNotice, setShowNotice] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  const productNames = cartItems.map(item => item.name).join(', ');

  const handleAgree = () => {
    setShowNotice(false);
    setShowPayment(true);
  };

  const handleClose = () => {
    // 返回产品页或购物车
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">结算</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">订单信息</h2>
          
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">数量: {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-800">${item.price}</p>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
            <p className="text-lg font-bold text-gray-800">总计</p>
            <p className="text-2xl font-bold text-orange-600">${totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">联系信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="用于接收eSIM二维码"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                eSIM二维码将发送到此邮箱，请确保地址正确
              </p>
            </div>
          </div>
        </div>

        {/* Payment Section (shown after agreement) */}
        {showPayment && (
          <PaymentForm 
            amount={totalAmount}
            email={customerEmail}
            cartItems={cartItems}
          />
        )}
      </div>

      {/* Purchase Notice Modal */}
      <PurchaseNoticeModal
        isOpen={showNotice}
        onClose={handleClose}
        onAgree={handleAgree}
        productName={productNames}
      />
    </div>
  );
}

// Payment Form Component
function PaymentForm({ amount, email, cartItems }: { amount: number; email: string; cartItems: CartItem[] }) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'usdt'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!email) {
      alert('请输入邮箱地址');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Call payment API
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          email,
          items: cartItems,
          method: paymentMethod
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to payment page or show QR code
        if (paymentMethod === 'stripe') {
          window.location.href = data.paymentUrl;
        } else {
          // Show USDT payment info
          alert(`请向以下地址支付 ${amount} USDT:\n${data.walletAddress}`);
        }
      } else {
        alert('支付创建失败: ' + data.error);
      }
    } catch (error) {
      alert('支付处理失败');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">支付方式</h2>
      
      <div className="space-y-3 mb-6">
        <label 
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
            paymentMethod === 'stripe' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="stripe"
            checked={paymentMethod === 'stripe'}
            onChange={() => setPaymentMethod('stripe')}
            className="w-5 h-5 text-orange-600"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-800">信用卡 / 借记卡</p>
            <p className="text-sm text-gray-500">支持 Visa, Mastercard, Amex</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Visa</span>
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">MC</span>
          </div>
        </label>

        <label 
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
            paymentMethod === 'usdt' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="usdt"
            checked={paymentMethod === 'usdt'}
            onChange={() => setPaymentMethod('usdt')}
            className="w-5 h-5 text-orange-600"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-800">USDT (TRC-20)</p>
            <p className="text-sm text-gray-500">加密货币支付</p>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">USDT</span>
        </label>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? '处理中...' : `确认支付 $${amount.toFixed(2)}`}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        点击支付即表示您已同意服务条款
      </p>
    </div>
  );
}
