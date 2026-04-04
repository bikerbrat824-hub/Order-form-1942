/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Truck, 
  Store, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Download,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
type PickupMethod = 'shipping' | 'pickup';
type ItemStyle = 'A' | 'B';

interface OrderItem {
  id: string;
  style: ItemStyle;
  content: string;
  illustration: string;
  hasCase: boolean;
}

interface ContactInfo {
  name: string;
  phone: string;
  phoneRegion: string;
  shippingRegion: string;
  address?: string;
}

interface OrderData {
  pickupMethod: PickupMethod | null;
  items: OrderItem[];
  contact: ContactInfo;
  agreedToTerms: boolean;
}

const CHARM_PRICE = 40;
const CASE_PRICE = 12;

const PHONE_REGIONS = [
  { label: '🇨🇳 中國 (+86)', value: '+86', length: [11] },
  { label: '🇭🇰 香港 (+852)', value: '+852', length: [8] },
  { label: '🇲🇴 澳門 (+853)', value: '+853', length: [8] },
  { label: '🇹🇼 台灣 (+886)', value: '+886', length: [9] },
  { label: '🇲🇾 馬來西亞 (+60)', value: '+60', length: [9, 10] },
];

const SHIPPING_REGIONS = [
  { label: '內地地區 (順豐到付)', value: 'mainland' },
  { label: '香港地區 (京東到付)', value: 'hk' },
  { label: '其他海外地區 (另議)', value: 'overseas' },
];

export default function App() {
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState<OrderData>({
    pickupMethod: null,
    items: [{ id: crypto.randomUUID(), style: 'A', content: '', illustration: '', hasCase: false }],
    contact: { name: '', phone: '', phoneRegion: '+86', shippingRegion: 'mainland', address: '' },
    agreedToTerms: false,
  });

  const isPurelyEnglish = (str: string) => /^[a-zA-Z\s]*$/.test(str);

  const isValidContent = (content: string, style: 'A' | 'B') => {
    if (!content) return false;
    const isEng = isPurelyEnglish(content);
    // English count excludes spaces
    const count = isEng ? content.replace(/\s/g, '').length : content.length;
    if (style === 'A') {
      return isEng ? count <= 20 : count <= 8;
    } else {
      return isEng ? count <= 12 : count <= 5;
    }
  };

  const getContentCount = (content: string) => {
    if (isPurelyEnglish(content)) {
      return content.replace(/\s/g, '').length;
    }
    return content.length;
  };

  const downloadOrderFile = () => {
    const itemsText = order.items.map((item, i) => `
[項目 ${i + 1}]
款式：${item.style === 'A' ? 'A 款 (書籤)' : 'B 款 (卡片)'}
內容：${item.content}
插圖描述：${item.illustration}
加購外殼：${item.hasCase ? '是' : '否'}
`).join('\n');

    const orderContent = `
[永利紙料 - 訂製訂單回執]
--------------------------
訂單編號：${orderId}
日期：${new Date().toLocaleDateString()}
取貨方式：${order.pickupMethod === 'shipping' 
      ? SHIPPING_REGIONS.find(r => r.value === order.contact.shippingRegion)?.label 
      : '自取 (澳門半島亞豐素街5D地下A座，宏基超市對面)'}

[訂單詳情]
${itemsText}

[聯絡資訊]
收件人：${order.contact.name}
電話：${order.contact.phoneRegion} ${order.contact.phone}
${order.pickupMethod === 'shipping' ? `地址：${order.contact.address}` : ''}

運送方式：順豐到付
總計金額：¥ ${totalAmount}
--------------------------
提示：請將此檔案連同支付證明傳回微信。
`;

    const blob = new Blob([orderContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `永利紙料_訂製訂單_${orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const validatePhone = () => {
    const region = PHONE_REGIONS.find(r => r.value === order.contact.phoneRegion);
    if (!region) return false;
    const digitsOnly = order.contact.phone.replace(/\D/g, '');
    return region.length.includes(digitsOnly.length);
  };

  const totalAmount = useMemo(() => {
    const charmsTotal = order.items.length * CHARM_PRICE;
    const casesTotal = order.items.filter(i => i.hasCase).length * CASE_PRICE;
    return charmsTotal + casesTotal;
  }, [order.items]);

  const orderId = useMemo(() => {
    const now = new Date();
    const Y = now.getFullYear();
    const M = String(now.getMonth() + 1).padStart(2, '0');
    const D = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    return `${Y}${M}${D}${h}${m}`;
  }, []);

  const updateItem = (id: string, updates: Partial<OrderItem>) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const addItem = () => {
    setOrder(prev => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), style: 'A', content: '', illustration: '', hasCase: false }]
    }));
  };

  const removeItem = (id: string) => {
    if (order.items.length > 1) {
      setOrder(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const validateStep = () => {
    if (step === 1) return order.pickupMethod !== null && order.agreedToTerms;
    if (step === 2) {
      return order.items.every(item => {
        return isValidContent(item.content, item.style) && item.illustration.length > 0;
      });
    }
    if (step === 3) {
      const basic = order.contact.name && validatePhone();
      return order.pickupMethod === 'shipping' ? basic && order.contact.address : basic;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-red-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">永</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">永利紙料</h1>
              <p className="text-xs text-stone-500 uppercase tracking-widest">Veng Lei Laboratory</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-stone-400 block uppercase">Step</span>
            <span className="text-sm font-bold text-red-700">{step} / 4</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-stone-100">
          <motion.div 
            className="h-full bg-red-700"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-red-700" />
                  第一階段：確認取貨方式
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrder(prev => ({ ...prev, pickupMethod: 'shipping' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      order.pickupMethod === 'shipping' 
                      ? 'border-red-700 bg-red-50' 
                      : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Truck className={`w-6 h-6 ${order.pickupMethod === 'shipping' ? 'text-red-700' : 'text-stone-400'}`} />
                      {order.pickupMethod === 'shipping' && <CheckCircle2 className="w-5 h-5 text-red-700" />}
                    </div>
                    <div className="font-bold">郵寄</div>
                    <div className="text-xs text-stone-500 mt-1">每張 ¥40，約 3 週發貨</div>
                    <div className="text-[10px] text-red-600 mt-1 font-medium leading-tight">
                      ※ 由於珠海發出，郵費為國內順豐普快<br />
                      ※ 香港單為澳門發出
                    </div>
                  </button>
                  <button
                    onClick={() => setOrder(prev => ({ ...prev, pickupMethod: 'pickup' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      order.pickupMethod === 'pickup' 
                      ? 'border-red-700 bg-red-50' 
                      : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Store className={`w-6 h-6 ${order.pickupMethod === 'pickup' ? 'text-red-700' : 'text-stone-400'}`} />
                      {order.pickupMethod === 'pickup' && <CheckCircle2 className="w-5 h-5 text-red-700" />}
                    </div>
                    <div className="font-bold">自取 (澳門半島亞豐素街5D地下A座，宏基超市對面)</div>
                    <div className="text-xs text-stone-500 mt-1">每張 ¥40，需提前 7-10 天</div>
                  </button>
                </div>
              </section>

              {order.pickupMethod && (
                <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-stone-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-700" />
                    服務條款告知
                  </h3>
                  <ul className="text-sm text-stone-600 space-y-2 list-disc pl-4">
                    <li>
                      <span className="font-bold text-stone-800">風格說明：</span>
                      所有插圖由小畫家以品牌風格二次創作，不保證與原創圖案完全一致。
                    </li>
                    <li>
                      <span className="font-bold text-stone-800">謹慎下單：</span>
                      「不提供文字校對服務，請謹慎填寫」。發貨前不提供返圖，請謹慎下單。
                    </li>
                    {order.pickupMethod === 'shipping' ? (
                      <li>內地「順豐到付」，香港「京東到付」。</li>
                    ) : (
                      <li>需提前 7-10 天預約（自付款日起算）。地點為澳門半島亞豐素街5D地下A座，宏基超市對面。</li>
                    )}
                    <li>訂製產品不退不換。</li>
                  </ul>
                  <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={order.agreedToTerms}
                      onChange={(e) => setOrder(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                      className="w-5 h-5 accent-red-700"
                    />
                    <span className="text-sm font-medium">我已閱讀並同意以上所有規則</span>
                  </label>
                </section>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-red-700" />
                  第二階段：詳細規格收集
                </h2>
                <button 
                  onClick={addItem}
                  className="flex items-center gap-1 text-sm font-bold text-red-700 hover:text-red-800"
                >
                  <Plus className="w-4 h-4" /> 新增一張
                </button>
              </div>

              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={item.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative group">
                    <div className="absolute -left-3 top-6 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                    
                    {order.items.length > 1 && (
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute right-4 top-4 text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}

                    <div className="space-y-5 mt-2">
                      {/* Style Selection */}
                      <div>
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">尺寸款式</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => updateItem(item.id, { style: 'A' })}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all ${
                              item.style === 'A' ? 'border-red-700 bg-red-50 text-red-700' : 'border-stone-100 bg-stone-50 text-stone-500'
                            }`}
                          >
                            A 款 (書籤款)
                            <span className="block text-[10px] font-normal opacity-70">中 ≤ 8 / 英 ≤ 20</span>
                          </button>
                          <button
                            onClick={() => updateItem(item.id, { style: 'B' })}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all ${
                              item.style === 'B' ? 'border-red-700 bg-red-50 text-red-700' : 'border-stone-100 bg-stone-50 text-stone-500'
                            }`}
                          >
                            B 款 (卡片款)
                            <span className="block text-[10px] font-normal opacity-70">中 ≤ 5 / 英 ≤ 12</span>
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">文字內容 (直出不校對)</label>
                          <span className={`text-[10px] font-bold ${!isValidContent(item.content, item.style) && item.content.length > 0 ? 'text-red-600' : 'text-stone-400'}`}>
                            {getContentCount(item.content)} / {isPurelyEnglish(item.content) ? (item.style === 'A' ? '20' : '12') : (item.style === 'A' ? '8' : '5')}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={item.content}
                          onChange={(e) => updateItem(item.id, { content: e.target.value })}
                          placeholder={item.style === 'A' ? '中 ≤ 8 / 英 ≤ 20 (不計空格)' : '中 ≤ 5 / 英 ≤ 12 (不計空格)'}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-700/20 focus:border-red-700 outline-none transition-all"
                        />
                        {!isValidContent(item.content, item.style) && item.content.length > 0 && (
                          <p className="text-[10px] text-red-600 mt-1 font-bold">
                            {isPurelyEnglish(item.content) 
                              ? '您的英文字數（不含空格）已超過款式限制，請修改' 
                              : '字數超過限制，請縮減內容'}
                          </p>
                        )}
                      </div>

                      {/* Illustration */}
                      <div>
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">插圖/公仔描述</label>
                        <textarea
                          value={item.illustration}
                          onChange={(e) => updateItem(item.id, { illustration: e.target.value })}
                          placeholder={item.style === 'A' ? "建議提供 2 個 圖案描述動作（上限 2 個），或明確的動物品種與性別。" : "只能提供 1 個 圖案或文字描述，動作描述上限 2 個，或明確的動物品種與性別。"}
                          rows={2}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-700/20 focus:border-red-700 outline-none transition-all resize-none"
                        />
                        {item.style === 'B' && item.illustration.length > 0 && (
                          <p className="text-[10px] text-stone-500 mt-1 italic">※ B 款提醒：動作描述上限 2 個</p>
                        )}
                        <p className="text-[10px] text-stone-400 mt-2 leading-tight">
                          ※ 聲明：所有插圖由小畫家以品牌風格二次創作，不保證與原創圖案完全一致。發貨前不返圖，請謹慎下單。
                        </p>
                      </div>

                      {/* Case Add-on */}
                      <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors border border-stone-100">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={item.hasCase}
                            onChange={(e) => updateItem(item.id, { hasCase: e.target.checked })}
                            className="w-5 h-5 accent-red-700"
                          />
                          <div>
                            <span className="text-sm font-bold">加購保護殼 (+¥12)</span>
                            <span className="block text-[10px] text-stone-500">{item.style === 'A' ? '軟套' : '硬套 (可放兩張或地鐵卡)'}</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-red-700" />
                第三階段：聯絡資料收集
              </h2>

              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">姓名</label>
                  <input
                    type="text"
                    value={order.contact.name}
                    onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, name: e.target.value } }))}
                    placeholder="收件人姓名"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-700/20 focus:border-red-700 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">聯絡電話</label>
                  <div className="flex gap-2 mb-2">
                    <select
                      value={order.contact.phoneRegion}
                      onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, phoneRegion: e.target.value } }))}
                      className="px-3 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-700/20 focus:border-red-700 outline-none transition-all text-sm font-bold"
                    >
                      {PHONE_REGIONS.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={order.contact.phone}
                      onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                      placeholder="請輸入電話號碼"
                      className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-700/20 focus:border-red-700 outline-none transition-all"
                    />
                  </div>
                  {!validatePhone() && order.contact.phone.length > 0 && (
                    <p className="text-[10px] text-red-600 font-bold">電話位數不正確，請重新輸入</p>
                  )}
                  {order.pickupMethod === 'pickup' && (
                    <p className="text-[10px] text-red-600 mt-1 font-medium">※ 取件時需核對手機末 4 碼</p>
                  )}
                </div>

                {order.pickupMethod === 'shipping' && (
                  <div>
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">配送地區</label>
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      {SHIPPING_REGIONS.map(r => (
                        <button
                          key={r.value}
                          onClick={() => setOrder(prev => ({ ...prev, contact: { ...prev.contact, shippingRegion: r.value } }))}
                          className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all text-left ${
                            order.contact.shippingRegion === r.value ? 'border-red-700 bg-red-50 text-red-700' : 'border-stone-100 bg-stone-50 text-stone-500'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">詳細地址</label>
                    <textarea
                      value={order.contact.address}
                      onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))}
                      placeholder="請輸入詳細收件地址"
                      rows={3}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-700/20 focus:border-red-700 outline-none transition-all resize-none"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">訂單已生成</h2>
                <p className="text-stone-500 text-sm">請核對以下資訊並截圖回傳</p>
              </div>

              {/* Order Summary Table (The "Cold" Table) */}
              <div id="order-summary" className="bg-white border-2 border-stone-900 overflow-hidden rounded-lg shadow-xl">
                <div className="bg-stone-900 text-white p-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-bold tracking-tighter">永利紙料 - 訂製訂單回執</span>
                    <span className="text-[10px] opacity-70 font-mono">ID: {orderId}</span>
                  </div>
                  <span className="text-xs opacity-70">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm border-b border-stone-100 pb-4">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">取貨方式</span>
                      <span className="font-bold">
                        {order.pickupMethod === 'shipping' 
                          ? SHIPPING_REGIONS.find(r => r.value === order.contact.shippingRegion)?.label 
                          : '自取 (澳門半島亞豐素街5D地下A座，宏基超市對面)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">聯絡人</span>
                      <span className="font-bold">{order.contact.name}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">電話</span>
                      <span className="font-bold">{order.contact.phoneRegion} {order.contact.phone}</span>
                    </div>
                    {order.pickupMethod === 'shipping' && (
                      <div className="col-span-2">
                        <span className="text-stone-400 text-[10px] uppercase font-bold block">地址</span>
                        <span className="font-bold">{order.contact.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">訂製詳情 ({order.items.length} 張)</span>
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-stone-900 text-left">
                          <th className="py-2 pr-2 font-bold">#</th>
                          <th className="py-2 px-2 font-bold">款式</th>
                          <th className="py-2 px-2 font-bold">文字</th>
                          <th className="py-2 px-2 font-bold">插圖描述</th>
                          <th className="py-2 pl-2 font-bold text-right">外殼</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={item.id} className="border-b border-stone-100">
                            <td className="py-3 pr-2 font-mono text-xs">{i + 1}</td>
                            <td className="py-3 px-2 font-medium">{item.style === 'A' ? '書籤' : '名片'}</td>
                            <td className="py-3 px-2 font-bold text-red-700">{item.content}</td>
                            <td className="py-3 px-2 text-xs text-stone-600 leading-tight">{item.illustration}</td>
                            <td className="py-3 pl-2 text-right font-medium">{item.hasCase ? '有' : '無'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total */}
                  <div className="bg-stone-50 p-4 rounded-lg flex justify-between items-center border border-stone-200">
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-500">總計金額</span>
                      <span className="text-[10px] text-stone-400 uppercase font-bold">運費說明：順豐到付</span>
                    </div>
                    <span className="text-2xl font-black text-red-700">¥ {totalAmount}</span>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 text-center border-t border-red-100">
                  <p className="text-[10px] text-red-800 font-bold uppercase tracking-widest">
                    發貨前不返圖，請謹慎下單 • 截圖此表格回傳微信
                  </p>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center space-y-6">
                <div className="p-4 bg-stone-50 rounded-xl text-left space-y-3">
                  <p className="text-xs font-bold text-stone-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                    結案指令：
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    請下載下方的<span className="font-bold text-red-700">「訂單摘要文件」</span>，並將該檔案與<span className="font-bold text-red-700">「支付成功截圖」</span>一併傳回微信 (WeChat) 帳號：<span className="font-bold underline">13718718337</span>。確認成功支付後，我們將正式將訂單轉交給小畫家製作！
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 p-4 z-20">
        <div className="max-w-2xl mx-auto flex gap-4">
          {step > 1 && step < 4 && (
            <button
              onClick={prevStep}
              className="flex-1 py-4 px-6 rounded-xl border border-stone-200 font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
            >
              [ ⬅️ 上一步 ]
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!validateStep()}
              className={`flex-[2] py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                validateStep() 
                ? 'bg-red-700 text-white shadow-lg shadow-red-700/20 hover:bg-red-800' 
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {step === 3 ? '生成訂單' : '[ 下一步 ➡️ ]'}
            </button>
          ) : (
            <div className="w-full space-y-4">
              <button
                onClick={downloadOrderFile}
                className="w-full py-4 px-6 bg-stone-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
              >
                <Download className="w-5 h-5" /> [ 📄 下載訂單文件：永利紙料_訂製訂單.txt ]
              </button>
              <div className="w-full text-center text-red-700 font-bold animate-pulse">
                完成並回傳微信
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
