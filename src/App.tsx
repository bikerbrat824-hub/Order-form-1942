/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
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
  BookOpen,
  ZoomIn,
  X,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  OrderItem, 
  ContactInfo, 
  OrderData, 
  SupportedLanguage 
} from './types';
import { translations } from './locales';

const CHARM_PRICE = 40;
const CASE_PRICE = 12;

const GUIDE_IMAGE_1 = 'https://lh3.googleusercontent.com/d/18c0qeMsWbzzxndsOzmUhHsblh0vU_9br';
const GUIDE_IMAGE_2 = 'https://lh3.googleusercontent.com/d/1DWnrs1SKGfmCW07Jkkz8V4o8DbOR2tbE';

const PHONE_REGIONS_CONFIG = [
  { key: '+86', value: '+86', length: [11] },
  { key: '+852', value: '+852', length: [8] },
  { key: '+853', value: '+853', length: [8] },
  { key: '+886', value: '+886', length: [9] },
  { key: '+60', value: '+60', length: [9, 10] },
];

const SHIPPING_REGION_KEYS: ('mainland' | 'hk' | 'overseas')[] = ['mainland', 'hk', 'overseas'];

export default function App() {
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('veng_lei_lang');
      if (saved === 'zh-TW' || saved === 'zh-CN' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'zh-TW';
  });

  const t = translations[lang];

  useEffect(() => {
    try {
      localStorage.setItem('veng_lei_lang', lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang === 'en' ? 'en' : lang === 'zh-CN' ? 'zh-Hans' : 'zh-Hant';
  }, [lang]);

  const [step, setStep] = useState(1);
  const [order, setOrder] = useState<OrderData>({
    pickupMethod: null,
    items: [{ id: crypto.randomUUID(), style: 'A', content: '', illustration: '', hasCase: false }],
    contact: { name: '', phone: '', phoneRegion: '+86', shippingRegion: 'mainland', address: '' },
    agreedToTerms: false,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'img1' | 'img2' | null>(null);

  const handleSetLang = (newLang: SupportedLanguage) => {
    setLang(newLang);
    // If there's an active error message, clear it to avoid stale language display
    setErrorMessage(null);
  };

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

  const validatePhone = () => {
    const region = PHONE_REGIONS_CONFIG.find(r => r.value === order.contact.phoneRegion);
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

  const downloadOrderFile = () => {
    const f = t.receiptFile;
    const itemsText = order.items.map((item, i) => `
${f.itemPrefix(i + 1)}
${f.style}：${item.style === 'A' ? t.step4.styleA : t.step4.styleB}
${f.content}：${item.content}
${f.illustration}：${item.illustration}
${f.case}：${item.hasCase ? t.step4.hasCaseYes : t.step4.hasCaseNo}
`).join('\n');

    const orderContent = `
${f.title}
${f.divider}
${f.orderId}：${orderId}
${f.date}：${new Date().toLocaleDateString()}
${f.pickupMethod}：${order.pickupMethod === 'shipping' 
      ? f.pickupMethodShipping 
      : f.pickupMethodPickup}
${order.pickupMethod === 'pickup' ? f.pickupDate(pickupDate) : f.shippingFee}

${f.detailsHeader}
${itemsText}

${f.contactHeader}
${f.recipient}：${order.contact.name}
${f.phone}：${order.contact.phoneRegion} ${order.contact.phone}
${order.pickupMethod === 'shipping' ? `${f.address}：${order.contact.address}` : ''}

${f.total}：¥ ${totalAmount}
${f.divider}
${f.tip}
`;

    const blob = new Blob([orderContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = f.filename(orderId);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const updateItem = (id: string, updates: Partial<OrderItem>) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const addItem = () => {
    setErrorMessage(null);
    const newId = crypto.randomUUID();
    setOrder(prev => ({
      ...prev,
      items: [...prev.items, { id: newId, style: 'A', content: '', illustration: '', hasCase: false }]
    }));
    setTimeout(() => {
      const el = document.getElementById(`item-card-${newId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = el.querySelector<HTMLInputElement>('input[type="text"]');
        if (input) input.focus();
      }
    }, 80);
  };

  const removeItem = (id: string) => {
    if (order.items.length > 1) {
      setOrder(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const validateStep = (showFeedback = false) => {
    if (step === 1) {
      if (!order.pickupMethod || !order.agreedToTerms) {
        if (showFeedback) {
          setErrorMessage(t.errors.step1Incomplete);
        }
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (order.pickupMethod === 'shipping' && order.items.length < 2) {
        if (showFeedback) {
          setErrorMessage(t.errors.step2ShippingMin2);
        }
        return false;
      }
      const allValid = order.items.every(item => {
        return isValidContent(item.content, item.style) && isValidIllustration(item.illustration);
      });
      if (!allValid) {
        if (showFeedback) {
          setErrorMessage(t.errors.step2InvalidItems);
        }
        return false;
      }
      return true;
    }
    if (step === 3) {
      const basic = !!(order.contact.name && validatePhone());
      const valid = order.pickupMethod === 'shipping' ? basic && !!order.contact.address : basic;
      if (!valid && showFeedback) {
        setErrorMessage(order.pickupMethod === 'shipping' ? t.errors.step3IncompleteShipping : t.errors.step3IncompleteBasic);
      }
      return valid;
    }
    return true;
  };

  const nextStep = () => {
    setErrorMessage(null);
    if (validateStep(true)) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    setErrorMessage(null);
    setStep(s => s - 1);
  };

  return (
    <div className="min-h-screen text-stone-900 font-sans selection:bg-red-100">
      {/* Header */}
      <header className="bg-white/40 backdrop-blur-xl border-b border-white/30 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-10 h-10 bg-red-700/85 backdrop-blur-md rounded-xl flex items-center justify-center text-white font-black text-xl border border-white/20 shadow-md shrink-0">
              {t.brand.short}
            </div>
            <div>
              <h1 className="font-black text-base sm:text-lg leading-tight tracking-tight text-stone-900">{t.brand.name}</h1>
              <p className="text-[9px] sm:text-[10px] text-stone-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold">{t.brand.sub}</p>
            </div>
          </div>

          {/* Right Action: Language Switcher & Step Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Buttons */}
            <div 
              id="language-switcher"
              className="flex items-center bg-white/70 backdrop-blur-md p-1 rounded-xl border border-stone-300/60 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500 ml-1.5 mr-1 hidden xs:block sm:block" />
              {(['zh-TW', 'zh-CN', 'en'] as SupportedLanguage[]).map((l) => (
                <button
                  key={l}
                  id={`lang-btn-${l}`}
                  type="button"
                  onClick={() => handleSetLang(l)}
                  className={`px-2 py-1 rounded-lg text-xs font-black transition-all ${
                    lang === l
                      ? 'bg-red-700 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                  }`}
                  title={l === 'zh-TW' ? '繁體中文' : l === 'zh-CN' ? '简体中文' : 'English'}
                >
                  {t.langNames[l]}
                </button>
              ))}
            </div>

            {/* Step Counter */}
            <div className="text-right shrink-0 pl-2 border-l border-stone-300/60">
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-400 block uppercase tracking-wider">{t.step}</span>
              <span className="text-xs sm:text-sm font-black text-red-700">{step} / 4</span>
            </div>
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
          {/* STEP 1: PICKUP METHOD */}
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
                  {t.step1.title}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Shipping Option */}
                  <button
                    id="pickup-method-shipping"
                    onClick={() => {
                      setErrorMessage(null);
                      setOrder(prev => ({ ...prev, pickupMethod: 'shipping' }));
                    }}
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
                    <div className="font-black text-lg tracking-tight">{t.step1.shipping.title}</div>
                    <div className="text-xs text-stone-600 mt-1 font-medium">{t.step1.shipping.priceSub}</div>
                    <div className="text-[11px] text-stone-600 mt-1 font-medium leading-snug">
                      {t.step1.shipping.desc}
                    </div>
                    <div className="text-[10px] text-red-700 mt-2 font-bold leading-tight bg-red-50/50 p-2 rounded-lg border border-red-100/50">
                      {t.step1.shipping.tip1}<br />
                      {t.step1.shipping.tip2}<br />
                      {t.step1.shipping.tip3}
                    </div>
                  </button>

                  {/* Pickup Option */}
                  <button
                    id="pickup-method-pickup"
                    onClick={() => {
                      setErrorMessage(null);
                      setOrder(prev => ({ ...prev, pickupMethod: 'pickup' }));
                    }}
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
                    <div className="font-black text-lg tracking-tight">{t.step1.pickup.title}</div>
                    <div className="text-xs text-stone-600 mt-1 font-medium leading-tight">
                      {t.step1.pickup.address}<br />
                      {t.step1.pickup.landmark}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-2 font-bold">{t.step1.pickup.priceSub}</div>
                  </button>
                </div>
              </section>

              {/* Terms Section */}
              {order.pickupMethod && (
                <section className="glass-card p-8 rounded-3xl space-y-5">
                  <h3 className="font-black text-stone-800 flex items-center gap-2 text-lg tracking-tight">
                    <AlertCircle className="w-5 h-5 text-red-700" />
                    {t.step1.terms.title}
                  </h3>
                  <ul className="text-sm text-stone-600 space-y-3 list-none">
                    <li className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700 mt-2 shrink-0" />
                      <div>
                        <span className="font-black text-stone-800">{t.step1.terms.styleTitle}</span>
                        {t.step1.terms.styleDesc}
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700 mt-2 shrink-0" />
                      <div>
                        <span className="font-black text-stone-800">{t.step1.terms.prudentTitle}</span>
                        {t.step1.terms.prudentDesc}
                      </div>
                    </li>
                    <li className="flex gap-3 bg-red-50/60 p-3.5 rounded-2xl border-2 border-red-200/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700 mt-2 shrink-0" />
                      <div className="text-xs text-stone-700 leading-relaxed">
                        <span className="font-black text-red-800">{t.step1.terms.forwardingNoticeTitle}</span>
                        {t.step1.terms.forwardingNoticeDesc}
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700 mt-2 shrink-0" />
                      <div>
                        {order.pickupMethod === 'shipping' ? (
                          <span>{t.step1.terms.deliveryShipping}</span>
                        ) : (
                          <span>{t.step1.terms.deliveryPickup}</span>
                        )}
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700 mt-2 shrink-0" />
                      <div>{t.step1.terms.noRefund}</div>
                    </li>
                  </ul>
                  <label className="flex items-center gap-4 p-4 bg-white/40 rounded-2xl cursor-pointer hover:bg-white/60 transition-all border-2 border-stone-300/50 group shadow-sm">
                    <div className="relative flex items-center justify-center">
                      <input
                        id="terms-checkbox"
                        type="checkbox"
                        checked={order.agreedToTerms}
                        onChange={(e) => setOrder(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                        className="w-6 h-6 rounded-lg border-2 border-stone-300 bg-white/20 checked:bg-red-700 checked:border-red-700 transition-all cursor-pointer appearance-none"
                      />
                      {order.agreedToTerms && <CheckCircle2 className="absolute w-4 h-4 text-white pointer-events-none" />}
                    </div>
                    <span className="text-sm font-black text-stone-700 group-hover:text-stone-900">{t.step1.terms.agreeCheckbox}</span>
                  </label>
                </section>
              )}
            </motion.div>
          )}

          {/* STEP 2: SPECIFICATIONS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
                    <ClipboardCheck className="w-5 h-5 text-red-700" />
                    {t.step2.title}
                  </h2>
                  <p className="text-xs text-stone-500 font-bold mt-1">
                    {t.step2.itemCount(order.items.length)}
                    {order.pickupMethod === 'shipping' && t.step2.shippingMinRequirement}
                  </p>
                </div>
                <button 
                  id="add-item-btn"
                  onClick={addItem}
                  className="flex items-center gap-1 text-sm font-black text-red-700 hover:text-red-800 transition-colors bg-red-50/60 px-4 py-2 rounded-xl border border-red-200/50 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> {t.step2.addItem}
                </button>
              </div>

              {/* Shipping Min 2 Items Warning Banner */}
              {order.pickupMethod === 'shipping' && order.items.length < 2 && (
                <div className="p-4 bg-red-50/90 border-2 border-red-300 rounded-2xl flex items-start gap-3 text-red-700 shadow-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs font-black leading-relaxed">
                    {t.step2.shippingMinAlert}
                  </div>
                </div>
              )}

              {/* 訂製參考說明圖導引區塊 */}
              <div className="glass-card p-6 rounded-3xl space-y-4 border-2 border-stone-300/60 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-red-100/80 text-red-700 rounded-xl border border-red-200/50">
                      <BookOpen className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-stone-900 text-sm tracking-tight flex items-center gap-2">
                        {t.step2.guideCard.title}
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-700 rounded-full border border-red-200">
                          {t.step2.guideCard.badge}
                        </span>
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {t.step2.guideCard.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 第 1 張：尺寸款式說明圖 */}
                  <div 
                    id="guide-card-img1"
                    onClick={() => setPreviewType('img1')}
                    className="group relative bg-white/50 rounded-2xl overflow-hidden border-2 border-stone-200/90 hover:border-red-500/70 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={GUIDE_IMAGE_1}
                        alt={t.step2.guideCard.img1Title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                        <span className="text-xs font-black flex items-center gap-1.5 drop-shadow">
                          <ZoomIn className="w-4 h-4 text-red-300" /> {t.step2.guideCard.clickZoom}
                        </span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-white/80 border-t border-stone-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                          {t.step2.guideCard.img1Badge}
                        </span>
                        <span className="text-[10px] text-stone-400 font-bold">{t.step2.guideCard.img1Tag}</span>
                      </div>
                      <div className="text-xs font-black text-stone-800">{t.step2.guideCard.img1Title}</div>
                      <p className="text-[11px] text-stone-500 font-medium mt-1 leading-snug">
                        {t.step2.guideCard.img1Sub}
                      </p>
                    </div>
                  </div>

                  {/* 第 2 張：加購保護殼樣式圖 */}
                  <div 
                    id="guide-card-img2"
                    onClick={() => setPreviewType('img2')}
                    className="group relative bg-white/50 rounded-2xl overflow-hidden border-2 border-stone-200/90 hover:border-red-500/70 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={GUIDE_IMAGE_2}
                        alt={t.step2.guideCard.img2Title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                        <span className="text-xs font-black flex items-center gap-1.5 drop-shadow">
                          <ZoomIn className="w-4 h-4 text-red-300" /> {t.step2.guideCard.clickZoom}
                        </span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-white/80 border-t border-stone-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                          {t.step2.guideCard.img2Badge}
                        </span>
                        <span className="text-[10px] text-stone-400 font-bold">{t.step2.guideCard.img2Tag}</span>
                      </div>
                      <div className="text-xs font-black text-stone-800">{t.step2.guideCard.img2Title}</div>
                      <p className="text-[11px] text-stone-500 font-medium mt-1 leading-snug">
                        {t.step2.guideCard.img2Sub}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-8">
                {order.items.map((item, index) => (
                  <div key={item.id} id={`item-card-${item.id}`} className="glass-card p-8 rounded-3xl relative group">
                    <div className="absolute -left-4 top-8 w-10 h-10 bg-stone-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-xl border border-white/20 backdrop-blur-md">
                      {index + 1}
                    </div>
                    
                    {order.items.length > 1 && (
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute right-6 top-6 text-stone-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50/50 rounded-xl"
                        title="Delete Item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}

                    <div className="space-y-6 mt-4">
                      {/* Style Selection */}
                      <div>
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 block">
                          {t.step2.item.styleLabel}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => updateItem(item.id, { style: 'A' })}
                            className={`px-4 py-3 rounded-2xl border-2 text-sm font-black transition-all ${
                              item.style === 'A' ? 'border-red-700/50 bg-red-50/30 text-red-700' : 'border-white/50 bg-white/20 text-stone-500 hover:border-white/80'
                            }`}
                          >
                            {t.step2.item.styleA}
                            <span className="block text-[10px] font-bold opacity-60 mt-0.5">{t.step2.item.styleAHint}</span>
                          </button>
                          <button
                            onClick={() => updateItem(item.id, { style: 'B' })}
                            className={`px-4 py-3 rounded-2xl border-2 text-sm font-black transition-all ${
                              item.style === 'B' ? 'border-red-700/50 bg-red-50/30 text-red-700' : 'border-white/50 bg-white/20 text-stone-500 hover:border-white/80'
                            }`}
                          >
                            {t.step2.item.styleB}
                            <span className="block text-[10px] font-bold opacity-60 mt-0.5">{t.step2.item.styleBHint}</span>
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block">
                            {t.step2.item.contentLabel}
                          </label>
                          <span className={`text-[10px] font-black ${!isValidContent(item.content, item.style) && item.content.length > 0 ? 'text-red-600' : 'text-stone-400'}`}>
                            {t.step2.item.weightLabel(getContentStats(item.content).totalWeight, item.style === 'A' ? 40 : 25)}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={item.content}
                          onChange={(e) => updateItem(item.id, { content: e.target.value })}
                          placeholder={item.style === 'A' ? t.step2.item.placeholderA : t.step2.item.placeholderB}
                          className="w-full px-5 py-4 glass-input rounded-2xl font-bold placeholder:text-stone-300"
                        />
                        {!isValidContent(item.content, item.style) && item.content.length > 0 && (
                          <p className="text-[10px] text-red-600 mt-2 font-black tracking-wide">
                            {getContentStats(item.content).cnCount > (item.style === 'A' ? 8 : 5) ? t.step2.item.cnExceed : 
                             getContentStats(item.content).enCount > (item.style === 'A' ? 15 : 12) ? t.step2.item.enExceed : 
                             t.step2.item.weightExceed}
                          </p>
                        )}
                      </div>

                      {/* Illustration */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block">
                            {t.step2.item.illustrationLabel}
                          </label>
                          <span className={`text-[10px] font-black ${!isValidIllustration(item.illustration) && item.illustration.length > 0 ? 'text-red-600' : 'text-stone-400'}`}>
                            {item.illustration.replace(/\s/g, '').length} / 25
                          </span>
                        </div>
                        <textarea
                          value={item.illustration}
                          onChange={(e) => updateItem(item.id, { illustration: e.target.value })}
                          placeholder={item.style === 'A' ? t.step2.item.illustrationPlaceholderA : t.step2.item.illustrationPlaceholderB}
                          rows={3}
                          className="w-full px-5 py-4 glass-input rounded-2xl font-bold placeholder:text-stone-300 resize-none"
                        />
                        {!isValidIllustration(item.illustration) && item.illustration.replace(/\s/g, '').length > 25 && (
                          <p className="text-[10px] text-red-600 mt-2 font-black tracking-wide">{t.step2.item.illustrationExceed}</p>
                        )}
                        {item.style === 'B' && item.illustration.length > 0 && (
                          <p className="text-[10px] text-stone-500 mt-2 font-bold italic">{t.step2.item.styleBReminder}</p>
                        )}
                        <p className="text-[10px] text-stone-400 mt-3 leading-relaxed font-medium">
                          {t.step2.item.illustrationDisclaimer}
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
                            <span className="text-sm font-black text-stone-700 group-hover:text-stone-900">{t.step2.item.caseLabel}</span>
                            <span className="block text-[10px] text-stone-500 font-bold">{item.style === 'A' ? t.step2.item.caseSubA : t.step2.item.caseSubB}</span>
                          </div>
                        </div>
                      </label>

                      {/* 每一張下方的「新增一張」優化功能區塊 */}
                      <div className="pt-5 mt-6 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-100/50 -mx-8 -mb-8 p-5 sm:px-8 rounded-b-3xl">
                        <div className="text-xs text-stone-600 font-bold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                          <span>{t.step2.cardFooterHint}</span>
                        </div>
                        <button
                          type="button"
                          id={`add-item-below-btn-${item.id}`}
                          onClick={addItem}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{t.step2.addItem}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 列表底部的顯眼大卡片新增按鈕 */}
                <div className="pt-2">
                  <button
                    type="button"
                    id="add-item-bottom-big-btn"
                    onClick={addItem}
                    className="w-full py-5 px-6 rounded-3xl border-2 border-dashed border-red-300 hover:border-red-600 bg-white/60 hover:bg-red-50/70 transition-all flex items-center justify-center gap-4 text-stone-800 hover:text-red-700 shadow-sm hover:shadow-md group cursor-pointer active:scale-[0.99]"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-red-700 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-sm sm:text-base flex items-center gap-2">
                        <span>{t.step2.bottomAddTitle(order.items.length + 1)}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full border border-red-200">
                          + ¥40
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {t.step2.bottomAddSubtitle}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONTACT INFORMATION */}
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
                {t.step3.title}
              </h2>

              <div className="glass-card p-10 rounded-3xl space-y-8">
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 block">{t.step3.nameLabel}</label>
                  <input
                    type="text"
                    value={order.contact.name}
                    onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, name: e.target.value } }))}
                    placeholder={t.step3.namePlaceholder}
                    className="w-full px-5 py-4 glass-input rounded-2xl font-bold placeholder:text-stone-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 block">{t.step3.phoneLabel}</label>
                  <div className="flex gap-3 mb-3">
                    <select
                      value={order.contact.phoneRegion}
                      onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, phoneRegion: e.target.value } }))}
                      className="px-4 py-4 glass-input rounded-2xl font-black text-sm"
                    >
                      {PHONE_REGIONS_CONFIG.map(r => (
                        <option key={r.value} value={r.value}>{t.step3.phoneRegions[r.key]}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={order.contact.phone}
                      onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                      placeholder={t.step3.phonePlaceholder}
                      className="flex-1 px-5 py-4 glass-input rounded-2xl font-bold placeholder:text-stone-300"
                    />
                  </div>
                  {!validatePhone() && order.contact.phone.length > 0 && (
                    <p className="text-[10px] text-red-600 font-black tracking-wide">{t.step3.phoneError}</p>
                  )}
                  {order.pickupMethod === 'pickup' && (
                    <p className="text-[10px] text-red-700 mt-2 font-bold">{t.step3.phonePickupNote}</p>
                  )}
                </div>

                {order.pickupMethod === 'shipping' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 block">{t.step3.shippingRegionLabel}</label>
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {SHIPPING_REGION_KEYS.map(key => (
                          <button
                            key={key}
                            onClick={() => setOrder(prev => ({ ...prev, contact: { ...prev.contact, shippingRegion: key } }))}
                            className={`px-5 py-4 rounded-2xl border-2 text-sm font-black transition-all text-left ${
                              order.contact.shippingRegion === key ? 'border-red-700/50 bg-red-50/30 text-red-700' : 'border-white/50 bg-white/20 text-stone-500 hover:border-white/80'
                            }`}
                          >
                            {t.step3.regions[key]}
                          </button>
                        ))}
                      </div>
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 block">{t.step3.addressLabel}</label>
                      <textarea
                        value={order.contact.address}
                        onChange={(e) => setOrder(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))}
                        placeholder={t.step3.addressPlaceholder}
                        rows={4}
                        className="w-full px-5 py-4 glass-input rounded-2xl font-bold placeholder:text-stone-300 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 4: ORDER SUMMARY & SUBMISSION */}
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
                <h2 className="text-3xl font-black tracking-tight">{t.step4.successTitle}</h2>
                <p className="text-stone-500 text-sm font-bold">{t.step4.successSubtitle}</p>
              </div>

              {/* Order Summary Table */}
              <div id="order-summary" className="glass-card overflow-hidden rounded-3xl shadow-2xl">
                <div className="bg-stone-900/90 backdrop-blur-md text-white p-6 flex justify-between items-center border-b border-white/10">
                  <div className="flex flex-col">
                    <span className="font-black tracking-tighter text-lg">{t.step4.receiptHeader}</span>
                    <span className="text-[10px] opacity-70 font-mono font-bold tracking-widest">ID: {orderId}</span>
                  </div>
                  <span className="text-xs opacity-70 font-bold">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-6 text-sm border-b border-white/50 pb-6">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest mb-1">{t.step4.pickupMethodLabel}</span>
                      <span className="font-black text-stone-800">
                        {order.pickupMethod === 'shipping' 
                          ? t.step4.pickupMethodShipping 
                          : t.step4.pickupMethodPickup}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest mb-1">
                        {order.pickupMethod === 'pickup' ? t.step4.pickupDateLabel : t.step4.shippingFeeLabel}
                      </span>
                      <span className="font-black text-stone-800">
                        {order.pickupMethod === 'pickup' 
                          ? t.step4.pickupDateVal(pickupDate) 
                          : t.step4.shippingFeeVal}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest mb-1">{t.step4.contactPersonLabel}</span>
                      <span className="font-black text-stone-800">{order.contact.name}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest mb-1">{t.step4.phoneLabel}</span>
                      <span className="font-black text-stone-800">{order.contact.phoneRegion} {order.contact.phone}</span>
                    </div>
                    {order.pickupMethod === 'shipping' && (
                      <div className="col-span-2">
                        <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest mb-1">{t.step4.addressLabel}</span>
                        <span className="font-black text-stone-800 leading-relaxed">{order.contact.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    <span className="text-stone-400 text-[10px] uppercase font-black block tracking-widest">{t.step4.itemsHeader(order.items.length)}</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b-2 border-stone-900 text-left">
                            <th className="py-3 pr-3 font-black uppercase text-[10px] tracking-widest">{t.step4.colIndex}</th>
                            <th className="py-3 px-3 font-black uppercase text-[10px] tracking-widest">{t.step4.colStyle}</th>
                            <th className="py-3 px-3 font-black uppercase text-[10px] tracking-widest">{t.step4.colContent}</th>
                            <th className="py-3 px-3 font-black uppercase text-[10px] tracking-widest">{t.step4.colIllustration}</th>
                            <th className="py-3 pl-3 font-black uppercase text-[10px] tracking-widest text-right">{t.step4.colCase}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, i) => (
                            <tr key={item.id} className="border-b border-white/50">
                              <td className="py-4 pr-3 font-mono text-xs font-bold">{i + 1}</td>
                              <td className="py-4 px-3 font-black">{item.style === 'A' ? t.step4.styleA : t.step4.styleB}</td>
                              <td className="py-4 px-3 font-black text-red-700">{item.content}</td>
                              <td className="py-4 px-3 text-xs text-stone-600 leading-relaxed font-bold">{item.illustration}</td>
                              <td className="py-4 pl-3 text-right font-black">{item.hasCase ? t.step4.hasCaseYes : t.step4.hasCaseNo}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl flex justify-between items-center border border-white/50 shadow-inner">
                    <div className="flex flex-col">
                      <span className="font-black text-stone-500 uppercase text-[10px] tracking-widest">{t.step4.totalAmountLabel}</span>
                      <span className="text-[10px] text-stone-400 uppercase font-black tracking-tighter mt-1">
                        {order.pickupMethod === 'pickup' ? t.step4.pickupDateVal(pickupDate) : t.step4.shippingFeeVal}
                      </span>
                    </div>
                    <span className="text-3xl font-black text-red-700 tracking-tighter">¥ {totalAmount}</span>
                  </div>
                </div>
                
                <div className="bg-red-700/10 backdrop-blur-md p-5 text-center border-t border-red-700/20">
                  <p className="text-[10px] text-red-800 font-black uppercase tracking-[0.2em]">
                    {t.step4.warningBanner}
                  </p>
                </div>
              </div>

              {/* Payment Section */}
              <div className="glass-card p-10 rounded-3xl text-center space-y-6">
                <div className="p-6 bg-white/30 rounded-2xl text-left space-y-4 border border-white/50">
                  <p className="text-xs font-black text-stone-800 flex items-center gap-2 uppercase tracking-widest">
                    <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
                    {t.step4.instructionsTitle}
                  </p>
                  <p className="text-sm text-stone-600 leading-relaxed font-bold">
                    {t.step4.instructionsText}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Error Message Toast / Prompt */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-4 right-4 max-w-2xl mx-auto z-30"
          >
            <div className="p-4 bg-red-800/95 backdrop-blur-xl text-white rounded-2xl font-black text-xs shadow-2xl flex items-center justify-between gap-3 border border-red-400/30">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-200" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-white/80 hover:text-white text-xs px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors shrink-0"
              >
                {t.nav.close}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Zoom Lightbox Modal */}
      <AnimatePresence>
        {previewType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewType(null)}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-stone-900/95 border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 px-6 border-b border-white/10">
                <div>
                  <h4 className="text-white font-black text-sm">
                    {previewType === 'img1' ? t.step2.guideCard.img1ModalTitle : t.step2.guideCard.img2ModalTitle}
                  </h4>
                  <p className="text-stone-300 text-xs mt-0.5 font-medium">
                    {previewType === 'img1' ? t.step2.guideCard.img1ModalDesc : t.step2.guideCard.img2ModalDesc}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewType(null)}
                  className="p-2 text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all shrink-0 ml-4"
                  title={t.nav.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex items-center justify-center overflow-auto bg-stone-950/60 flex-1">
                <img
                  src={previewType === 'img1' ? GUIDE_IMAGE_1 : GUIDE_IMAGE_2}
                  alt={previewType === 'img1' ? t.step2.guideCard.img1Title : t.step2.guideCard.img2Title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[68vh] object-contain rounded-xl shadow-lg"
                />
              </div>
              <div className="p-3 text-center bg-stone-900/90 border-t border-white/10">
                <button
                  onClick={() => setPreviewType(null)}
                  className="text-xs font-bold text-stone-300 hover:text-white px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                >
                  {t.nav.closePreview}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/40 backdrop-blur-2xl border-t border-white/30 p-6 z-20">
        <div className="max-w-2xl mx-auto flex gap-4">
          {step > 1 && step < 4 && (
            <button
              id="prev-step-btn"
              onClick={prevStep}
              className="flex-1 py-4 px-6 rounded-2xl glass-button-secondary font-black flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> {t.nav.prev}
            </button>
          )}
          {step < 4 ? (
            <button
              id="next-step-btn"
              onClick={nextStep}
              className={`flex-[2] py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
                validateStep(false) 
                ? 'glass-button-primary' 
                : 'glass-button-secondary border-red-300/80 text-stone-800 hover:border-red-400'
              }`}
            >
              {step === 3 ? t.nav.generate : t.nav.next}
              {step < 3 && <ChevronRight className="w-5 h-5" />}
            </button>
          ) : (
            <div className="w-full space-y-4">
              <button
                id="download-order-btn"
                onClick={downloadOrderFile}
                className="w-full py-5 px-6 glass-button-primary rounded-2xl font-black flex items-center justify-center gap-3 text-lg"
              >
                <Download className="w-6 h-6" /> {t.nav.downloadBtn}
              </button>
              <div className="w-full text-center text-red-700 font-black animate-pulse tracking-widest uppercase text-sm">
                {t.nav.downloadSub}
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
