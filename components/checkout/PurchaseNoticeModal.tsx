'use client';

import { useState } from 'react';
import { X, Smartphone, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface PurchaseNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  productName: string;
}

export default function PurchaseNoticeModal({ 
  isOpen, 
  onClose, 
  onAgree,
  productName 
}: PurchaseNoticeModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'device' | 'refund' | 'usage' | 'terms'>('device');

  if (!isOpen) return null;

  const handleAgree = () => {
    if (!agreed) {
      alert('请先阅读并同意购买须知');
      return;
    }
    onAgree();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">购买须知</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="bg-orange-50 px-6 py-3 border-b border-orange-100">
          <p className="text-orange-800 font-medium">
            您正在购买: <span className="font-bold">{productName}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'device', label: '设备兼容' },
            { id: 'refund', label: '退款政策' },
            { id: 'usage', label: '使用说明' },
            { id: 'terms', label: '服务条款' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === tab.id 
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
          {activeTab === 'device' && <DeviceContent />}
          {activeTab === 'refund' && <RefundContent />}
          {activeTab === 'usage' && <UsageContent />}
          {activeTab === 'terms' && <TermsContent />}
        </div>

        {/* Agreement Checkbox */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
            />
            <span className="text-gray-700 text-sm">
              我已阅读并同意以上所有条款，确认我的设备支持eSIM功能，
              <span className="text-red-600 font-medium">了解产品售出后概不退换的政策</span>
            </span>
          </label>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleAgree}
            disabled={!agreed}
            className={`flex-1 px-4 py-3 rounded-xl font-medium ${
              agreed 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            确认并支付
          </button>
        </div>
      </div>
    </div>
  );
}

// Device Compatibility Content
function DeviceContent() {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h3 className="font-bold text-green-800 mb-3">支持的设备</h3>
        <ul className="space-y-2 text-green-700">
          <li>✓ iPhone XS / XR 及更新机型 (iOS 12.1+)</li>
          <li>✓ iPad Pro / Air / Mini (支持蜂窝网络的型号)</li>
          <li>✓ Google Pixel 3 及更新机型</li>
          <li>✓ Samsung Galaxy S20 / Note 20 及更新</li>
          <li>✓ Samsung Galaxy Z Fold / Flip 系列</li>
          <li>✓ Motorola Razr 系列</li>
        </ul>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-bold text-red-800 mb-3">不支持的设备</h3>
        <ul className="space-y-2 text-red-700">
          <li>✗ iPhone 8 及更早机型</li>
          <li>✗ 仅支持实体 SIM 卡的设备</li>
          <li>✗ 运营商锁定的设备</li>
          <li>✗ 中国大陆版 iPhone (部分型号无eSIM)</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-800 text-sm">
          <strong>如何检查:</strong> 设置 → 通用 → 关于本机 → 查看是否有 "IMEI" 和 "ICCID" 两个号码
        </p>
      </div>
    </div>
  );
}

// Refund Policy Content
function RefundContent() {
  return (
    <div className="space-y-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
        <h3 className="font-bold text-red-800 mb-2">重要声明</h3>
        <p className="text-red-700">本产品售出后概不退换，请在购买前仔细确认。</p>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">订单状态</th>
            <th className="border border-gray-300 px-3 py-2 text-left">退款政策</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-3 py-2">未激活</td>
            <td className="border border-gray-300 px-3 py-2 text-green-600">✓ 7天内可申请退款</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-3 py-2">已安装未使用</td>
            <td className="border border-gray-300 px-3 py-2 text-red-600">✗ 不可退款</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">已激活使用</td>
            <td className="border border-gray-300 px-3 py-2 text-red-600">✗ 不可退款</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-3 py-2">已过期</td>
            <td className="border border-gray-300 px-3 py-2 text-red-600">✗ 不可退款</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">设备不支持</td>
            <td className="border border-gray-300 px-3 py-2 text-red-600">✗ 不可退款</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Usage Instructions Content
function UsageContent() {
  return (
    <div className="space-y-4">
      {[
        { step: 1, title: '购买后', desc: 'eSIM二维码将发送至您的邮箱，请保存好邮件和二维码' },
        { step: 2, title: '安装时机', desc: '请在到达目的地后再安装，提前安装可能导致套餐提前过期' },
        { step: 3, title: '安装步骤', desc: '设置 → 蜂窝网络 → 添加eSIM → 扫描二维码' },
        { step: 4, title: '开启漫游', desc: '安装后必须开启数据漫游才能使用' },
        { step: 5, title: '保存重要', desc: '每个eSIM只能安装一次，删除后无法重新安装' }
      ].map((item) => (
        <div key={item.step} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
            {item.step}
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{item.title}</h4>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        </div>
      ))}

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-yellow-800 text-sm">
          <strong>用量查询:</strong> 本系统不提供实时用量查询，请通过手机设置查看数据使用情况
        </p>
      </div>
    </div>
  );
}

// Terms Content
function TermsContent() {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      <h3 className="font-bold text-gray-800">服务条款</h3>
      <ol className="space-y-3 list-decimal list-inside">
        <li>用户购买前必须确认设备支持eSIM功能。</li>
        <li>产品售出后概不退换，除未激活产品可在7天内申请退款。</li>
        <li>eSIM二维码通过邮件发送，请确保邮箱地址正确。</li>
        <li>每个eSIM只能安装一次，删除后无法重新获取。</li>
        <li>请在到达目的地后再安装eSIM，提前安装可能导致套餐过期。</li>
        <li>本系统不提供实时用量查询服务。</li>
        <li>网络覆盖取决于当地运营商，可能存在信号盲区。</li>
        <li>如有问题请联系客服：xilixi@xigrocoltd.com</li>
      </ol>
    </div>
  );
}
