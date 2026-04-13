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

  const getContentStats = (content: string) => {
    const clean = content.replace(/\s/g, '');
    let cnCount = 0;
    let enCount = 0;
    for (const char of clean) {
      if (/[\u4e00-\u9fa5]/.test(char)) {
        cnCount++;
      } else {
        enCount++;
      }
    }
    return { cnCount, enCount, totalWeight: cnCount * 5 + enCount };
  };

  const isValidContent = (content: string, style: 'A' | 'B') => {
    if (!content) return false;
    const { cnCount, enCount, totalWeight } = getContentStats(content);
    if (style === 'A') {
      return cnCount <= 8 && enCount <= 15 && totalWeight <= 40;
    } else {
      return cnCount <= 5 && enCount <= 12 && totalWeight <= 25;
    }
  };

  const isValidIllustration = (illustration: string) => {
    const clean = illustration.replace(/\s/g, '');
    return clean.length > 0 && clean.length <= 25;
  };

  const downloadOrderFile = () => {
    const itemsText = order.items.map((item, i) => `
[項目 ${i + 1}]
款式：${item.style === 'A' ? 'A款 書籤' : 'B款 卡片'}
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
      ? '郵寄' 
      : `自取 (澳門半島亞豐素街5D地下A座)`}
${order.pickupMethod === 'pickup' ? `自取日期：${pickupDate} (下單後 8 天)` : '運費方式：順豐到付（不包郵）'}

[訂單詳情]
${itemsText}

[聯絡資訊]
收件人：${order.contact.name}
電話：${order.contact.phoneRegion} ${order.contact.phone}
${order.pickupMethod === 'shipping' ? `地址：${order.contact.address}` : ''}

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

  const pickupDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 8);
    return date.toISOString().split('T')[0];
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
        return isValidContent(item.content, item.style) && isValidIllustration(item.illustration);
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
    <div className="min-h-screen text-stone-900 font-sans selection:bg-red-100">
      {/* Header */}
      <header className="bg-white/30 backdrop-blur-xl border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-700/80 backdrop-blur-md rounded-lg flex items-center justify-center text-white font-bold text-xl border border-white/20 shadow-lg">永</div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">永利紙料</h1>
              <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-bold">Veng Lei Laboratory</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">Step</span>
            <span className="text-sm font-black text-red-700">{step} / 4</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-white/20">
          <motion.div 
            className="h-full bg-red-700/60 backdrop-blur-sm"
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
                <h2 className="text-xl font-black mb-4 flex items-center gap-2 tracking-tight">
                  <Truck className="w-5 h-5 text-red-700" />
                  第一階段：確認取貨方式
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrder(prev => ({ ...prev, pickupMethod: 'shipping' }))}
                    className={`p-5 rounded-2xl border-2 transition-all text-left glass-card ${
                      order.pickupMethod === 'shipping' 
                      ? 'border-red-700/50 bg-red-50/30' 
                      : 'border-white/50 hover:border-white/80'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Truck className={`w-7 h-7 ${order.pickupMethod === 'shipping' ? 'text-red-700' : 'text-stone-400'}`} />
                      {order.pickupMethod === 'shipping' && <CheckCircle2 className="w-6 h-6 text-red-700" />}
                    </div>
                    <div className="font-black text-lg tracking-tight">郵寄</div>
                    <div className="text-xs text-stone-600 mt-1 font-medium">每張 ¥40，約 3 週發貨</div>
                    <div className="text-[10px] text-red-700 mt-2 font-bold leading-tight bg-red-50/50 p-2 rounded-lg border border-red-100/50">
                      ※ 由於珠海發出，郵費為國內順豐普快<br />
                      ※ 香港單為澳門發出
                    </div>
                  </button>
                  <button
                    onClick={() => setOrder(prev => ({ ...prev, pickupMethod: 'pickup' }))}
                    className={`p-5 rounded-2xl border-2 transition-all text-left glass-card ${
                      order.pickupMethod === 'pickup' 
                      ? 'border-red-700/50 bg-red-50/30' 
                      : 'border-white/50 hover:border-white/80'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Store className={`w-7 h-7 ${order.pickupMethod === 'pickup' ? 'text-red-700' : 'text-stone-400'}`} />
                      {order.pickupMethod === 'pickup' && <CheckCircle2 className="w-6 h-6 text-red-700" />}
                    </div>
                    <div className="font-black text-lg tracking-tight">自取</div>
                    <div className="text-xs text-stone-600 mt-1 font-medium leading-tight">
                      澳門半島亞豐素街5D地下A座<br />
                      (宏基超市對面)
                    </div>
                    <div className="text-[10px] text-stone-500 mt-2 font-bold">每張 ¥40，需提前 7-10 天</div>
                  </button>
                </div>
              </section>

              {order.pickupMethod && (
                <section className="glass-card p-8 rounded-3xl space-y-5">
                  <h3 className="font-black text-stone-800 flex items-center gap-2 text-lg tracking-tight">
                    <AlertCircle className="w-5 h-5 text-red-700" />
                    服務條款告知
                  </h3>
                  <ul className="text-sm text-stone-600 space-y-3 list-none">
                    <li className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700 mt-2 shrink-0" />
                      <div>
                        <span className="font-black text-stone-800">風格說明：</span>
                        所有插圖由小畫家以品牌風格二次創作，不保證與原創圖案完全一致。
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700 mt-2 shrink-0" />
                      <div>
                        <span className="font-black text-stone-800">謹慎下單：</span>
                        「不提供文字校對服務，請謹慎填寫」。發貨前不提供返圖，請謹慎下單。
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700 mt-2 shrink-0" />
                      <div>
                        {order.pickupMethod === 'shipping' ? (
                          <span>內地「順豐到付」，香港「京東到付」。</span>
                        ) : (
                          <span>需提前 7-10 天預約（自付款日起算）。地點為澳門半島亞豐素街5D地下A座，宏基超市對面。</span>
                        )}
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700 mt-2 shrink-0" />
                      <div>訂製產品不退不換。</div>
                    </li>
                  </ul>
                  <label className="flex items-center gap-4 p-4 bg-white/40 rounded-2xl cursor-pointer hover:bg-white/60 transition-all border-2 border-stone-300/50 group shadow-sm">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={order.agreedToTerms}
                        onChange={(e) => setOrder(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                        className="w-6 h-6 rounded-lg border-2 border-stone-300 bg-white/20 checked:bg-red-700 checked:border-red-700 transition-all cursor-pointer appearance-none"
                      />
                      {order.agreedToTerms && <CheckCircle2 className="absolute w-4 h-4 text-white pointer-events-none" />}
                    </div>
                    <span className="text-sm font-black text-stone-700 group-hover:text-stone-900">我已閱讀並同意以上所有規則</span>
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
                <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
                  <ClipboardCheck className="w-5 h-5 text-red-700" />
                  第二階段：詳細規格收集
                </h2>
                <button 
                  onClick={addItem}
                  className="flex items-center gap-1 text-sm font-black text-red-700 hover:text-red-800 transition-colors"
                >
                  <Plus className="w-4 h-4" /> 新增一張
                </button>
              </div>

              <div className="space-y-8">
                {order.items.map((item, index) => (
                  <div key={item.id} className="glass-card p-8 rounded-3xl relative group">
                    <div className="absolute -left-4 top-8 w-10 h-10 bg-stone-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-xl border border-white/20 backdrop-blur-md">
                      {index + 1}
                    </div>
                    
                    {order.items.length > 1 && (
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute right-6 top-6 text-stone-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50/50 rounded-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}

                    <div className="space-y-6 mt-4">
                      {/* Style Selection */}
                      <div>
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 block">尺寸款式</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => updateItem(item.id, { style: 'A' })}
                            className={`px-4 py-3 rounded-2xl border-2 text-sm font-black transition-all ${
                              item.style === 'A' ? 'border-red-700/50 bg-red-50/30 text-red-700' : 'border-white/50 bg-white/20 text-stone-500 hover:border-white/80'
                            }`}
                          >
                            A 款 (書籤款)
                            <span className="block text-[10px] font-bold opacity-60 mt-0.5">中 ≤ 8 / 英 ≤ 20</span>
                          </button>
                          <button
                            onClick={() => updateItem(item.id, { style: 'B' })}
                            className={`px-4 py-3 rounded-2xl border-2 text-sm font-black transition-all ${
                              item.style === 'B' ? 'border-red-700/50 bg-red-50/30 text-red-700' : 'border-white/50 bg-white/20 text-stone-500 hover:border-white/80'
                            }`}
                          >
                            B 款 (卡片款)
                            <span className="block text-[10px] font-bold opacity-60 mt-0.5">中 ≤ 5 / 英 ≤ 12</span>
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block">文字內容 (直出不校對)</label>
                          <span className={`text-[10px] font-black ${!isValidContent(item.content, item.style) && item.content.length > 0 ? 'text-red-600' : 'text-stone-400'}`}>
                            權重: {getContentStats(item.content).totalWeight} / {item.style === 'A' ? '40' : '25'}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={item.content}
                          onChange={(e) => updateItem(item.id, { content: e.target.value })}
                          placeholder={item.style === 'A' ? '中 ≤ 8 / 英 ≤ 15 (1中=5英)' : '中 ≤ 5 / 英 ≤ 12 (1中=5英)'}
                          className="w-full px-5 py-4 glass-input rounded-2xl font-bold placeholder:text-stone-300"
                        />
                        {!isValidContent(item.content, item.style) && item.content.length > 0 && (
                          <p className="text-[10px] text-red-600 mt-2 font-black tracking-wide">
                            {getContentStats(item.content).cnCount > (item.style === 'A' ? 8 : 5) ? '中文字數超限' : 
                             getContentStats(item.content).enCount > (item.style === 'A' ? 15 : 12) ? '英文字數超限' : 
                             '總權重超過視覺平衡限制'}
                          </p>
                        )}
                      </div>

                      {/* Illustration */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block">插圖/公仔描述</label>
                          <span className={`text-[10px] font-black ${!isValidIllustration(item.illustration) && item.illustration.length > 0 ? 'text-red-600' : 'text-stone-400'}`}>
                            {item.illustration.replace(/\s/g, '').length} / 25
                          </span>
                        </div>
                        <textarea
                          value={item.illustration}
                          onChange={(e) => updateItem(item.id, { illustration: e.target.value })}
                          placeholder={item.style === 'A' ? "建議提供 2 個 圖案描述動作（上限 2 個），或明確的動物品種與性別。" : "只能提供 1 個 圖案或文字描述，動作描述上限 2 個，或明確的動物品種與性別。"}
                          rows={3}
                          className="w-full px-5 py-4 glass-input rounded-2xl font-bold placeholder:text-stone-300 resize-none"
                        />
                        {!isValidIllustration(item.illustration) && item.illustration.replace(/\s/g, '').length > 25 && (
                          <p className="text-[10px] text-red-600 mt-2 font-black tracking-wide">描述字數超限 (上限 25 字)</p>
                        )}
                        {item.style === 'B' && item.illustration.length > 0 && (
                          <p className="text-[10px] text-stone-500 mt-2 font-bold italic">※ B 款提醒：動作描述上限 2 個</p>
                        )}
                        <p className="text-[10px] text-stone-400 mt-3 leading-relaxed font-medium">
                          ※ 聲明：所有插圖由小畫家以品牌風格二次創作，不保證與原創圖案完全一致。發貨前不返圖，請謹慎下單。
                        </p>
                      </div>

                      {/* Case Add-on */}
                      <label className="flex items-center justify-between p-4 bg-white/40 rounded-2xl cursor-pointer hover:bg-white/60 transition-all border-2 border-stone-300/50 group shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={item.hasCase}
                              onChange={(e) => updateItem(item.id, { hasCase: e.target.checked })}
                              className="w-6 h-6 rounded-lg border-2 border-stone-300 bg-white/20 checked:bg-red-700 checked:border-red-700 transition-all cursor-pointer appearance-none"
                            />
                            {item.hasCase && <CheckCircle2 className="absolute w-4 h-4 text-white pointer-events-none" />}
                          </div>
                          <div>
                            <span className="text-sm font-black text-stone-700 group-hover:text-stone-900">加購保護殼 (+¥12)</span>
                            <span className="block text-[10px] text-stone-500 font-bold">{item.style === 'A' ? '軟套' : '硬套 (可放兩張 or 地鐵卡)'}</span>
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
              <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
                <CheckCircle2 className="w-5 h-5 text-red-700" />
                第三階段：聯絡資料收集
              </h2>

              <div className="glass-card p-10 rounded-3xl space-y-8">
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 block">姓名</label>
                  <input
                    type="text"
                    value={order.contact.name}
                    onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, name: e.target.value } }))}
                    placeholder="收件人姓名"
                    className="w-full px-5 py-4 glass-input rounded-2xl font-bold placeholder:text-stone-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 block">聯絡電話</label>
                  <div className="flex gap-3 mb-3">
                    <select
                      value={order.contact.phoneRegion}
                      onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, phoneRegion: e.target.value } }))}
                      className="px-4 py-4 glass-input rounded-2xl font-black text-sm"
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
                      className="flex-1 px-5 py-4 glass-input rounded-2xl font-bold placeholder:text-stone-300"
                    />
                  </div>
                  {!validatePhone() && order.contact.phone.length > 0 && (
                    <p className="text-[10px] text-red-600 font-black tracking-wide">電話位數不正確，請重新輸入</p>
                  )}
                  {order.pickupMethod === 'pickup' && (
                    <p className="text-[10px] text-red-700 mt-2 font-bold">※ 取件時需核對手機末 4 碼</p>
                  )}
                </div>

                {order.pickupMethod === 'shipping' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 block">配送地區</label>
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {SHIPPING_REGIONS.map(r => (
                          <button
                            key={r.value}
                            onClick={() => setOrder(prev => ({ ...prev, contact: { ...prev.contact, shippingRegion: r.value } }))}
                            className={`px-5 py-4 rounded-2xl border-2 text-sm font-black transition-all text-left ${
                              order.contact.shippingRegion === r.value ? 'border-red-700/50 bg-red-50/30 text-red-700' : 'border-white/50 bg-white/20 text-stone-500 hover:border-white/80'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 block">詳細地址</label>
                      <textarea
                        value={order.contact.address}
                        onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))}
                        placeholder="請輸入詳細收件地址"
                        rows={4}
                        className="w-full px-5 py-4 glass-input rounded-2xl font-bold placeholder:text-stone-300 resize-none"
                      />
                    </div>
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
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100/50 backdrop-blur-md text-green-600 rounded-3xl mb-2 border border-green-200/50 shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">訂單已生成</h2>
                <p className="text-stone-500 text-sm font-bold">請核對以下資訊並下載訂單文件</p>
              </div>

              {/* Order Summary Table (The "Cold" Table) */}
              <div id="order-summary" className="glass-card overflow-hidden rounded-3xl shadow-2xl">
                <div className="bg-stone-900/90 backdrop-blur-md text-white p-6 flex justify-between items-center border-b border-white/10">
                  <div className="flex flex-col">
                    <span className="font-black tracking-tighter text-lg">永利紙料 - 訂製訂單回執</span>
                    <span className="text-[10px] opacity-70 font-mono font-bold tracking-widest">ID: {orderId}</span>
                  </div>
                  <span className="text-xs opacity-70 font-bold">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-6 text-sm border-b border-white/50 pb-6">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest mb-1">取貨方式</span>
                      <span className="font-black text-stone-800">
                        {order.pickupMethod === 'shipping' 
                          ? '郵寄' 
                          : '自取 (澳門半島亞豐素街5D地下A座)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest mb-1">
                        {order.pickupMethod === 'pickup' ? '自取日期' : '運費方式'}
                      </span>
                      <span className="font-black text-stone-800">
                        {order.pickupMethod === 'pickup' 
                          ? `${pickupDate} (下單後 8 天)` 
                          : '順豐到付（不包郵）'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest mb-1">聯絡人</span>
                      <span className="font-black text-stone-800">{order.contact.name}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest mb-1">電話</span>
                      <span className="font-black text-stone-800">{order.contact.phoneRegion} {order.contact.phone}</span>
                    </div>
                    {order.pickupMethod === 'shipping' && (
                      <div className="col-span-2">
                        <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest mb-1">地址</span>
                        <span className="font-black text-stone-800 leading-relaxed">{order.contact.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest">訂製詳情 ({order.items.length} 張)</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b-2 border-stone-900 text-left">
                            <th className="py-3 pr-3 font-black uppercase text-[10px] tracking-widest">#</th>
                            <th className="py-3 px-3 font-black uppercase text-[10px] tracking-widest">款式</th>
                            <th className="py-3 px-3 font-black uppercase text-[10px] tracking-widest">文字</th>
                            <th className="py-3 px-3 font-black uppercase text-[10px] tracking-widest">插圖描述</th>
                            <th className="py-3 pl-3 font-black uppercase text-[10px] tracking-widest text-right">外殼</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, i) => (
                            <tr key={item.id} className="border-b border-white/50">
                              <td className="py-4 pr-3 font-mono text-xs font-bold">{i + 1}</td>
                              <td className="py-4 px-3 font-black">{item.style === 'A' ? 'A款 書籤' : 'B款 卡片'}</td>
                              <td className="py-4 px-3 font-black text-red-700">{item.content}</td>
                              <td className="py-4 px-3 text-xs text-stone-600 leading-relaxed font-bold">{item.illustration}</td>
                              <td className="py-4 pl-3 text-right font-black">{item.hasCase ? '有' : '無'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl flex justify-between items-center border border-white/50 shadow-inner">
                    <div className="flex flex-col">
                      <span className="font-black text-stone-500 uppercase text-[10px] tracking-widest">總計金額</span>
                      <span className="text-[10px] text-stone-400 uppercase font-black tracking-tighter mt-1">
                        {order.pickupMethod === 'pickup' ? `自取日期：${pickupDate}` : '運費方式：順豐到付（不包郵）'}
                      </span>
                    </div>
                    <span className="text-3xl font-black text-red-700 tracking-tighter">¥ {totalAmount}</span>
                  </div>
                </div>
                
                <div className="bg-red-700/10 backdrop-blur-md p-5 text-center border-t border-red-700/20">
                  <p className="text-[10px] text-red-800 font-black uppercase tracking-[0.2em]">
                    發貨前不返圖，請謹慎下單 • 下載訂單文件回傳微信
                  </p>
                </div>
              </div>

              {/* Payment Section */}
              <div className="glass-card p-10 rounded-3xl text-center space-y-6">
                <div className="p-6 bg-white/30 rounded-2xl text-left space-y-4 border border-white/50">
                  <p className="text-xs font-black text-stone-800 flex items-center gap-2 uppercase tracking-widest">
                    <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
                    結案指令：
                  </p>
                  <p className="text-sm text-stone-600 leading-relaxed font-bold">
                    請下載下方的<span className="font-black text-red-700">「訂單摘要文件」</span>，並將該檔案與<span className="font-black text-red-700">「支付成功截圖」</span>一併傳回微信 (WeChat) 帳號：<span className="font-black underline decoration-red-700/30 decoration-2 underline-offset-4">13718718337</span>。確認成功支付後，我們將正式將訂單轉交給小畫家製作！
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/40 backdrop-blur-2xl border-t border-white/30 p-6 z-20">
        <div className="max-w-2xl mx-auto flex gap-4">
          {step > 1 && step < 4 && (
            <button
              onClick={prevStep}
              className="flex-1 py-4 px-6 rounded-2xl glass-button-secondary font-black flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> [ ⬅️ 上一步 ]
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!validateStep()}
              className={`flex-[2] py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
                validateStep() 
                ? 'glass-button-primary' 
                : 'bg-white/10 text-stone-400 cursor-not-allowed border border-white/10'
              }`}
            >
              {step === 3 ? '生成訂單' : '[ 下一步 ➡️ ]'}
              {step < 3 && <ChevronRight className="w-5 h-5" />}
            </button>
          ) : (
            <div className="w-full space-y-4">
              <button
                onClick={downloadOrderFile}
                className="w-full py-5 px-6 glass-button-primary rounded-2xl font-black flex items-center justify-center gap-3 text-lg"
              >
                <Download className="w-6 h-6" /> [ 📄 點擊PDF後回傳微信，並在微信中付款 ]
              </button>
              <div className="w-full text-center text-red-700 font-black animate-pulse tracking-widest uppercase text-sm">
                完成並回傳微信
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
