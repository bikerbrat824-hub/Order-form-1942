import { SupportedLanguage } from './types';

export interface TranslationDictionary {
  brand: {
    name: string;
    sub: string;
    short: string;
  };
  step: string;
  nav: {
    prev: string;
    next: string;
    generate: string;
    downloadBtn: string;
    downloadSub: string;
    close: string;
    closePreview: string;
  };
  langNames: {
    'zh-TW': string;
    'zh-CN': string;
    en: string;
  };
  step1: {
    title: string;
    shipping: {
      title: string;
      priceSub: string;
      desc: string;
      tip1: string;
      tip2: string;
      tip3: string;
    };
    pickup: {
      title: string;
      address: string;
      landmark: string;
      priceSub: string;
    };
    terms: {
      title: string;
      styleTitle: string;
      styleDesc: string;
      prudentTitle: string;
      prudentDesc: string;
      forwardingNoticeTitle: string;
      forwardingNoticeDesc: string;
      deliveryShipping: string;
      deliveryPickup: string;
      noRefund: string;
      agreeCheckbox: string;
    };
  };
  step2: {
    title: string;
    itemCount: (count: number) => string;
    shippingMinRequirement: string;
    addItem: string;
    cardFooterHint: string;
    addItemBelow: string;
    bottomAddTitle: (nextIndex: number) => string;
    bottomAddSubtitle: string;
    shippingMinAlert: string;
    guideCard: {
      badge: string;
      title: string;
      subtitle: string;
      img1Title: string;
      img1Sub: string;
      img1Badge: string;
      img1Tag: string;
      img1ModalTitle: string;
      img1ModalDesc: string;
      img2Title: string;
      img2Sub: string;
      img2Badge: string;
      img2Tag: string;
      img2ModalTitle: string;
      img2ModalDesc: string;
      clickZoom: string;
    };
    item: {
      styleLabel: string;
      styleA: string;
      styleAHint: string;
      styleB: string;
      styleBHint: string;
      contentLabel: string;
      weightLabel: (weight: number, max: number) => string;
      placeholderA: string;
      placeholderB: string;
      cnExceed: string;
      enExceed: string;
      weightExceed: string;
      illustrationLabel: string;
      illustrationPlaceholderA: string;
      illustrationPlaceholderB: string;
      illustrationExceed: string;
      styleBReminder: string;
      illustrationDisclaimer: string;
      caseLabel: string;
      caseSubA: string;
      caseSubB: string;
    };
  };
  step3: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneError: string;
    phonePickupNote: string;
    shippingRegionLabel: string;
    addressLabel: string;
    addressPlaceholder: string;
    regions: {
      mainland: string;
      hk: string;
      overseas: string;
    };
    phoneRegions: Record<string, string>;
  };
  step4: {
    successTitle: string;
    successSubtitle: string;
    receiptHeader: string;
    pickupMethodLabel: string;
    pickupMethodShipping: string;
    pickupMethodPickup: string;
    pickupDateLabel: string;
    pickupDateVal: (date: string) => string;
    shippingFeeLabel: string;
    shippingFeeVal: string;
    contactPersonLabel: string;
    phoneLabel: string;
    addressLabel: string;
    itemsHeader: (count: number) => string;
    colIndex: string;
    colStyle: string;
    colContent: string;
    colIllustration: string;
    colCase: string;
    styleA: string;
    styleB: string;
    hasCaseYes: string;
    hasCaseNo: string;
    totalAmountLabel: string;
    warningBanner: string;
    instructionsTitle: string;
    instructionsText: string;
  };
  errors: {
    step1Incomplete: string;
    step2ShippingMin2: string;
    step2InvalidItems: string;
    step3IncompleteBasic: string;
    step3IncompleteShipping: string;
  };
  receiptFile: {
    title: string;
    divider: string;
    orderId: string;
    date: string;
    pickupMethod: string;
    pickupMethodShipping: string;
    pickupMethodPickup: string;
    pickupDate: (date: string) => string;
    shippingFee: string;
    detailsHeader: string;
    itemPrefix: (index: number) => string;
    style: string;
    content: string;
    illustration: string;
    case: string;
    contactHeader: string;
    recipient: string;
    phone: string;
    address: string;
    total: string;
    tip: string;
    filename: (id: string) => string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  'zh-TW': {
    brand: {
      name: '永利紙料',
      sub: 'Veng Lei Laboratory',
      short: '永',
    },
    step: 'Step',
    nav: {
      prev: '[ ⬅️ 上一步 ]',
      next: '[ 下一步 ➡️ ]',
      generate: '生成訂單',
      downloadBtn: '[ 📄 下載訂單回執並回傳微信付款 ]',
      downloadSub: '完成並回傳微信',
      close: '關閉',
      closePreview: '關閉預覽',
    },
    langNames: {
      'zh-TW': '繁體',
      'zh-CN': '简体',
      en: 'EN',
    },
    step1: {
      title: '第一階段：確認取貨方式',
      shipping: {
        title: '代寄服務',
        priceSub: '每張 ¥40，約 3 週發貨',
        desc: '（由澳門協助帶至珠海轉寄內地快遞之代寄服務，請留意相關條款）',
        tip1: '※ 滿 2 張起方可享有代寄服務',
        tip2: '※ 由於珠海發出，郵費為國內順豐普快',
        tip3: '※ 香港單為澳門發出',
      },
      pickup: {
        title: '自取',
        address: '澳門半島亞豐素街5D地下A座',
        landmark: '(宏基超市對面)',
        priceSub: '每張 ¥40，需提前 7-10 天',
      },
      terms: {
        title: '服務條款告知',
        styleTitle: '風格說明：',
        styleDesc: '所有插圖由小畫家以品牌風格二次創作，不保證與原創圖案完全一致。',
        prudentTitle: '謹慎下單：',
        prudentDesc: '「不提供文字校對服務，請謹慎填寫」。發貨前不提供返圖，請謹慎下單。',
        forwardingNoticeTitle: '【代寄服務特別說明】：',
        forwardingNoticeDesc: '因本服務為澳門義務協助帶至珠海投遞之跨區代寄，為維持營運與出貨成本平衡，訂製滿 2 張或以上方可享有代寄服務。如僅訂製 1 張，請選擇澳門線下自取；若有代寄需求請調整訂購數量至 2 張以上。',
        deliveryShipping: '內地「順豐到付」，香港「京東到付」。',
        deliveryPickup: '需提前 7-10 天預約（自付款日起算）。地點為澳門半島亞豐素街5D地下A座，宏基超市對面。',
        noRefund: '訂製產品不退不換。',
        agreeCheckbox: '我已閱讀並同意以上所有規則',
      },
    },
    step2: {
      title: '第二階段：詳細規格收集',
      itemCount: (count) => `目前已建立 ${count} 張訂製項目`,
      shippingMinRequirement: ' (代寄服務需滿 2 張)',
      addItem: '新增一張',
      cardFooterHint: '需訂製多張？填完可直接點擊新增下一張',
      addItemBelow: '新增一張',
      bottomAddTitle: (nextIndex: number) => `點此新增第 ${nextIndex} 張訂製項目`,
      bottomAddSubtitle: '可自選不同字句、插圖與款式配件（滿 2 張起享代寄服務）',
      shippingMinAlert: '代寄服務需訂製 2 張或以上方可下單，請增加訂製數量或更改為自取方式。',
      guideCard: {
        badge: '點擊圖片可放大',
        title: '訂製款式與加購樣式參考圖',
        subtitle: '提供尺寸款式比較與保護殼配件樣式，填寫訂單時可參考以下說明',
        img1Title: '尺寸款式說明圖',
        img1Sub: 'A款書籤尺寸（字數較多）／ B款名片尺寸（可放手機殼後）',
        img1Badge: '圖 1 · 尺寸與款式',
        img1Tag: 'A/B款 尺寸對比',
        img1ModalTitle: '第 1 張：尺寸款式說明圖',
        img1ModalDesc: 'A款（書籤尺寸，字數6-7字內）／ B款（名片尺寸可放手機後背，字數5字內）',
        img2Title: '加購保護殼樣式圖',
        img2Sub: 'A款軟套（防水掛件）／ B款硬套（可正反放兩張或地鐵卡）',
        img2Badge: '圖 2 · 配件加購',
        img2Tag: '掛件軟套 / 硬套',
        img2ModalTitle: '第 2 張：加購保護殼樣式圖',
        img2ModalDesc: '掛件加購：A款軟套（只能放一張，防水，12/個）／ B款硬套（可正反放兩張或地鐵卡，12/個）',
        clickZoom: '點擊放大檢視',
      },
      item: {
        styleLabel: '尺寸款式',
        styleA: 'A 款 (書籤款)',
        styleAHint: '中 ≤ 8 / 英 ≤ 20',
        styleB: 'B 款 (卡片款)',
        styleBHint: '中 ≤ 5 / 英 ≤ 12',
        contentLabel: '文字內容 (直出不校對)',
        weightLabel: (weight, max) => `權重: ${weight} / ${max}`,
        placeholderA: '中 ≤ 8 / 英 ≤ 15 (1中=5英)',
        placeholderB: '中 ≤ 5 / 英 ≤ 12 (1中=5英)',
        cnExceed: '中文字數超限',
        enExceed: '英文字數超限',
        weightExceed: '總權重超過視覺平衡限制',
        illustrationLabel: '插圖/公仔描述',
        illustrationPlaceholderA: '建議提供 2 個 圖案描述動作（上限 2 個），或明確的動物品種與性別。',
        illustrationPlaceholderB: '只能提供 1 個 圖案或文字描述，動作描述上限 2 個，或明確的動物品種與性別。',
        illustrationExceed: '描述字數超限 (上限 25 字)',
        styleBReminder: '※ B 款提醒：動作描述上限 2 個',
        illustrationDisclaimer: '※ 聲明：所有插圖由小畫家以品牌風格二次創作，不保證與原創圖案完全一致。發貨前不返圖，請謹慎下單。',
        caseLabel: '加購保護殼 (+¥12)',
        caseSubA: '軟套',
        caseSubB: '硬套 (可放兩張 or 地鐵卡)',
      },
    },
    step3: {
      title: '第三階段：聯絡資料收集',
      nameLabel: '姓名',
      namePlaceholder: '收件人姓名',
      phoneLabel: '聯絡電話',
      phonePlaceholder: '請輸入電話號碼',
      phoneError: '電話位數不正確，請重新輸入',
      phonePickupNote: '※ 取件時需核對手機末 4 碼',
      shippingRegionLabel: '配送地區',
      addressLabel: '詳細地址',
      addressPlaceholder: '請輸入詳細收件地址',
      regions: {
        mainland: '內地地區 (順豐到付)',
        hk: '香港地區 (京東到付)',
        overseas: '其他海外地區 (另議)',
      },
      phoneRegions: {
        '+86': '🇨🇳 中國 (+86)',
        '+852': '🇭🇰 香港 (+852)',
        '+853': '🇲🇴 澳門 (+853)',
        '+886': '🇹🇼 台灣 (+886)',
        '+60': '🇲🇾 馬來西亞 (+60)',
      },
    },
    step4: {
      successTitle: '訂單已生成',
      successSubtitle: '請核對以下資訊並下載訂單文件',
      receiptHeader: '永利紙料 - 訂製訂單回執',
      pickupMethodLabel: '取貨方式',
      pickupMethodShipping: '代寄服務',
      pickupMethodPickup: '自取 (澳門半島亞豐素街5D地下A座)',
      pickupDateLabel: '自取日期',
      pickupDateVal: (date) => `${date} (下單後 8 天)`,
      shippingFeeLabel: '運費方式',
      shippingFeeVal: '順豐到付（不包郵）',
      contactPersonLabel: '聯絡人',
      phoneLabel: '電話',
      addressLabel: '地址',
      itemsHeader: (count) => `訂製詳情 (${count} 張)`,
      colIndex: '#',
      colStyle: '款式',
      colContent: '文字',
      colIllustration: '插圖描述',
      colCase: '外殼',
      styleA: 'A款 書籤',
      styleB: 'B款 卡片',
      hasCaseYes: '有',
      hasCaseNo: '無',
      totalAmountLabel: '總計金額',
      warningBanner: '發貨前不返圖，請謹慎下單 • 下載訂單文件回傳微信',
      instructionsTitle: '結案指令：',
      instructionsText: '請下載下方的「訂單摘要文件」，並將該檔案與「支付成功截圖」一併傳回微信 (WeChat) 帳號：13718718337。確認成功支付後，我們將正式將訂單轉交給小畫家製作！',
    },
    errors: {
      step1Incomplete: '請先選擇取貨方式並勾選同意服務條款',
      step2ShippingMin2: '代寄服務需訂製 2 張或以上方可下單，請增加訂製數量或更改為自取方式。',
      step2InvalidItems: '請檢查所有品項的文字內容與插圖描述是否符合規範',
      step3IncompleteBasic: '請完整填寫收件人姓名與正確長度的聯絡電話',
      step3IncompleteShipping: '請完整填寫收件人姓名、聯絡電話與詳細配送地址',
    },
    receiptFile: {
      title: '[永利紙料 - 訂製訂單回執]',
      divider: '--------------------------',
      orderId: '訂單編號',
      date: '日期',
      pickupMethod: '取貨方式',
      pickupMethodShipping: '代寄服務 (由澳門協助帶至珠海轉寄內地快遞)',
      pickupMethodPickup: '自取 (澳門半島亞豐素街5D地下A座)',
      pickupDate: (d) => `自取日期：${d} (下單後 8 天)`,
      shippingFee: '運費方式：順豐到付（不包郵）',
      detailsHeader: '[訂單詳情]',
      itemPrefix: (i) => `[項目 ${i}]`,
      style: '款式',
      content: '內容',
      illustration: '插圖描述',
      case: '加購外殼',
      contactHeader: '[聯絡資訊]',
      recipient: '收件人',
      phone: '電話',
      address: '地址',
      total: '總計金額',
      tip: '提示：請將此檔案連同支付證明傳回微信 (WeChat: 13718718337)。',
      filename: (id) => `永利紙料_訂製訂單_${id}.txt`,
    },
  },
  'zh-CN': {
    brand: {
      name: '永利纸料',
      sub: 'Veng Lei Laboratory',
      short: '永',
    },
    step: 'Step',
    nav: {
      prev: '[ ⬅️ 上一步 ]',
      next: '[ 下一步 ➡️ ]',
      generate: '生成订单',
      downloadBtn: '[ 📄 下载订单回执并回传微信付款 ]',
      downloadSub: '完成并回传微信',
      close: '关闭',
      closePreview: '关闭预览',
    },
    langNames: {
      'zh-TW': '繁體',
      'zh-CN': '简体',
      en: 'EN',
    },
    step1: {
      title: '第一阶段：确认取件方式',
      shipping: {
        title: '代寄服务',
        priceSub: '每张 ¥40，约 3 周发货',
        desc: '（由澳门协助带至珠海转寄内地快递之代寄服务，请留意相关条款）',
        tip1: '※ 满 2 张起方可享有代寄服务',
        tip2: '※ 由于珠海发出，邮费为国内顺丰普快',
        tip3: '※ 香港单为澳门发出',
      },
      pickup: {
        title: '自取',
        address: '澳门半岛亚丰素街5D地下A座',
        landmark: '(宏基超市对面)',
        priceSub: '每张 ¥40，需提前 7-10 天',
      },
      terms: {
        title: '服务条款告知',
        styleTitle: '风格说明：',
        styleDesc: '所有插图由小画家以品牌风格二次创作，不保证与原创图案完全一致。',
        prudentTitle: '谨慎下单：',
        prudentDesc: '「不提供文字校对服务，请谨慎填写」。发货前不提供返图，请谨慎下单。',
        forwardingNoticeTitle: '【代寄服务特别说明】：',
        forwardingNoticeDesc: '因本服务为澳门义务协助带至珠海投递之跨区代寄，为维持运营与出货成本平衡，订制满 2 张或以上方可享有代寄服务。如仅订制 1 张，请选择澳门线下自取；若有代寄需求请调整订购数量至 2 张以上。',
        deliveryShipping: '内地「顺丰到付」，香港「京东到付」。',
        deliveryPickup: '需提前 7-10 天预约（自付款日起算）。地点为澳门半岛亚丰素街5D地下A座，宏基超市对面。',
        noRefund: '定制产品不退不换。',
        agreeCheckbox: '我已阅读并同意以上所有规则',
      },
    },
    step2: {
      title: '第二阶段：详细规格收集',
      itemCount: (count) => `目前已建立 ${count} 张订制项目`,
      shippingMinRequirement: ' (代寄服务需满 2 张)',
      addItem: '新增一张',
      cardFooterHint: '需订制多张？填完可直接点击新增下一张',
      addItemBelow: '新增一张',
      bottomAddTitle: (nextIndex: number) => `点此新增第 ${nextIndex} 张订制项目`,
      bottomAddSubtitle: '可自选不同字句、插图与款式配件（满 2 张起享代寄服务）',
      shippingMinAlert: '代寄服务需订制 2 张或以上方可下单，请增加订制数量或更改为自取方式。',
      guideCard: {
        badge: '点击图片可放大',
        title: '定制款式与加购样式参考图',
        subtitle: '提供尺寸款式比较与保护壳配件样式，填写订单时可参考以下说明',
        img1Title: '尺寸款式说明图',
        img1Sub: 'A款书签尺寸（字数较多）／ B款名片尺寸（可放手机壳后）',
        img1Badge: '图 1 · 尺寸与款式',
        img1Tag: 'A/B款 尺寸对比',
        img1ModalTitle: '第 1 张：尺寸款式说明图',
        img1ModalDesc: 'A款（书签尺寸，字数6-7字内）／ B款（名片尺寸可放手机后背，字数5字内）',
        img2Title: '加购保护壳样式图',
        img2Sub: 'A款软套（防水挂件）／ B款硬套（可正反放两张或地铁卡）',
        img2Badge: '图 2 · 配件加购',
        img2Tag: '挂件软套 / 硬套',
        img2ModalTitle: '第 2 张：加购保护壳样式图',
        img2ModalDesc: '挂件加购：A款软套（只能放一张，防水，12/个）／ B款硬套（可正反放两张或地铁卡，12/个）',
        clickZoom: '点击放大检视',
      },
      item: {
        styleLabel: '尺寸款式',
        styleA: 'A 款 (书签款)',
        styleAHint: '中 ≤ 8 / 英 ≤ 20',
        styleB: 'B 款 (卡片款)',
        styleBHint: '中 ≤ 5 / 英 ≤ 12',
        contentLabel: '文字内容 (直出不校对)',
        weightLabel: (weight, max) => `权重: ${weight} / ${max}`,
        placeholderA: '中 ≤ 8 / 英 ≤ 15 (1中=5英)',
        placeholderB: '中 ≤ 5 / 英 ≤ 12 (1中=5英)',
        cnExceed: '中文字数超限',
        enExceed: '英文字数超限',
        weightExceed: '总权重超过视觉平衡限制',
        illustrationLabel: '插图/公仔描述',
        illustrationPlaceholderA: '建议提供 2 个 图案描述动作（上限 2 个），或明确的动物品种与性别。',
        illustrationPlaceholderB: '只能提供 1 个 图案或文字描述，动作描述上限 2 个，或明确的动物品种与性别。',
        illustrationExceed: '描述字数超限 (上限 25 字)',
        styleBReminder: '※ B 款提醒：动作描述上限 2 个',
        illustrationDisclaimer: '※ 声明：所有插图由小画家以品牌风格二次创作，不保证与原创图案完全一致。发货前不返图，请谨慎下单。',
        caseLabel: '加购保护壳 (+¥12)',
        caseSubA: '软套',
        caseSubB: '硬套 (可放两张 or 地铁卡)',
      },
    },
    step3: {
      title: '第三阶段：联络资料收集',
      nameLabel: '姓名',
      namePlaceholder: '收件人姓名',
      phoneLabel: '联络电话',
      phonePlaceholder: '请输入电话号码',
      phoneError: '电话位数不正确，请重新输入',
      phonePickupNote: '※ 取件时需核对手机末 4 位',
      shippingRegionLabel: '配送地区',
      addressLabel: '详细地址',
      addressPlaceholder: '请输入详细收件地址',
      regions: {
        mainland: '内地地区 (顺丰到付)',
        hk: '香港地区 (京东到付)',
        overseas: '其他海外地区 (另议)',
      },
      phoneRegions: {
        '+86': '🇨🇳 中国 (+86)',
        '+852': '🇭🇰 香港 (+852)',
        '+853': '🇲🇴 澳门 (+853)',
        '+886': '🇹🇼 台湾 (+886)',
        '+60': '🇲🇾 马来西亚 (+60)',
      },
    },
    step4: {
      successTitle: '订单已生成',
      successSubtitle: '请核对以下资讯并下载订单文件',
      receiptHeader: '永利纸料 - 定制订单回执',
      pickupMethodLabel: '取件方式',
      pickupMethodShipping: '代寄服务',
      pickupMethodPickup: '自取 (澳门半岛亚丰素街5D地下A座)',
      pickupDateLabel: '自取日期',
      pickupDateVal: (date) => `${date} (下单后 8 天)`,
      shippingFeeLabel: '运费方式',
      shippingFeeVal: '顺丰到付（不包邮）',
      contactPersonLabel: '联络人',
      phoneLabel: '电话',
      addressLabel: '地址',
      itemsHeader: (count) => `定制详情 (${count} 张)`,
      colIndex: '#',
      colStyle: '款式',
      colContent: '文字',
      colIllustration: '插图描述',
      colCase: '外壳',
      styleA: 'A款 书签',
      styleB: 'B款 卡片',
      hasCaseYes: '有',
      hasCaseNo: '无',
      totalAmountLabel: '总计金额',
      warningBanner: '发货前不返图，请谨慎下单 • 下载订单文件回传微信',
      instructionsTitle: '结案指令：',
      instructionsText: '请下载下方的「订单摘要文件」，并将该文件与「支付成功截图」一并传回微信 (WeChat) 账号：13718718337。确认成功支付后，我们将正式将订单转交给小画家制作！',
    },
    errors: {
      step1Incomplete: '请先选择取件方式并勾选同意服务条款',
      step2ShippingMin2: '代寄服务需订制 2 张或以上方可下单，请增加订制数量或更改为自取方式。',
      step2InvalidItems: '请检查所有品项的文字内容与插图描述是否符合规范',
      step3IncompleteBasic: '请完整填写收件人姓名与正确位数的联络电话',
      step3IncompleteShipping: '请完整填写收件人姓名、联络电话与详细配送地址',
    },
    receiptFile: {
      title: '[永利纸料 - 定制订单回执]',
      divider: '--------------------------',
      orderId: '订单编号',
      date: '日期',
      pickupMethod: '取件方式',
      pickupMethodShipping: '代寄服务 (由澳门协助带至珠海转寄内地快递)',
      pickupMethodPickup: '自取 (澳门半岛亚丰素街5D地下A座)',
      pickupDate: (d) => `自取日期：${d} (下单后 8 天)`,
      shippingFee: '运费方式：顺丰到付（不包邮）',
      detailsHeader: '[订单详情]',
      itemPrefix: (i) => `[项目 ${i}]`,
      style: '款式',
      content: '内容',
      illustration: '插图描述',
      case: '加购外壳',
      contactHeader: '[联络资讯]',
      recipient: '收件人',
      phone: '电话',
      address: '地址',
      total: '总计金额',
      tip: '提示：请将此文件连同支付证明传回微信 (WeChat: 13718718337)。',
      filename: (id) => `永利纸料_定制订单_${id}.txt`,
    },
  },
  'en': {
    brand: {
      name: 'Veng Lei Paper',
      sub: 'Veng Lei Laboratory',
      short: 'VL',
    },
    step: 'Step',
    nav: {
      prev: '[ ⬅️ Previous ]',
      next: '[ Next ➡️ ]',
      generate: 'Generate Order',
      downloadBtn: '[ 📄 Download Receipt & Send via WeChat ]',
      downloadSub: 'Complete & Send to WeChat',
      close: 'Close',
      closePreview: 'Close Preview',
    },
    langNames: {
      'zh-TW': '繁體',
      'zh-CN': '简体',
      en: 'EN',
    },
    step1: {
      title: 'Step 1: Select Pickup / Delivery Method',
      shipping: {
        title: 'Forwarding Service',
        priceSub: '¥40 each, ships in approx. 3 weeks',
        desc: '(Macau-assisted transit to Zhuhai courier forwarding; please note terms)',
        tip1: '※ Forwarding service requires min. 2 custom charms',
        tip2: '※ Dispatched from Zhuhai via SF Express (freight collect)',
        tip3: '※ Hong Kong orders are dispatched from Macau directly',
      },
      pickup: {
        title: 'In-Store Pickup',
        address: '5D Rua de Afonso de Albuquerque, G/F Block A, Macau Peninsula',
        landmark: '(Opposite Grand Mart)',
        priceSub: '¥40 each, 7-10 days notice required',
      },
      terms: {
        title: 'Terms of Service',
        styleTitle: 'Artistic Style: ',
        styleDesc: 'All illustrations are artist recreations in the brand style; exact 1:1 match with original reference is not guaranteed.',
        prudentTitle: 'Order Carefully: ',
        prudentDesc: '"No text proofreading service provided; please verify wording carefully." Pre-dispatch photos are not provided.',
        forwardingNoticeTitle: '【Forwarding Service Notice】: ',
        forwardingNoticeDesc: 'As this is voluntary cross-border transit from Macau to Zhuhai, orders of 2 or more custom charms are required for forwarding. For a single charm, please select in-store pickup in Macau or increase order quantity.',
        deliveryShipping: 'Mainland: SF Express (Collect). Hong Kong: JD Express (Collect).',
        deliveryPickup: 'Requires 7-10 days advance reservation from payment date. Location: 5D Rua de Afonso de Albuquerque, Block A, Macau (opposite Grand Mart).',
        noRefund: 'Customized items cannot be returned or exchanged.',
        agreeCheckbox: 'I have read and agree to all terms and conditions above',
      },
    },
    step2: {
      title: 'Step 2: Detailed Specifications',
      itemCount: (count) => `Currently configured ${count} charm(s)`,
      shippingMinRequirement: ' (Forwarding requires min. 2)',
      addItem: '+ Add Charm',
      cardFooterHint: 'Ordering multiple? Add next charm directly below',
      addItemBelow: '+ Add Charm',
      bottomAddTitle: (nextIndex: number) => `Add Charm #${nextIndex}`,
      bottomAddSubtitle: 'Customize individual style, text & case (min. 2 required for forwarding)',
      shippingMinAlert: 'Forwarding service requires at least 2 charms. Please add items or switch to in-store pickup.',
      guideCard: {
        badge: 'Click to zoom',
        title: 'Style & Accessory Reference Guide',
        subtitle: 'Compare sizes, layout styles, and protective case options before configuring',
        img1Title: 'Size & Style Comparison Guide',
        img1Sub: 'Style A: Bookmark size (more text) / Style B: Card size (fits phone case)',
        img1Badge: 'Guide 1 · Sizes & Styles',
        img1Tag: 'Style A vs B',
        img1ModalTitle: 'Guide 1: Size & Style Reference',
        img1ModalDesc: 'Style A (Bookmark size, 6-7 characters) / Style B (Card size for phone cases, up to 5 characters)',
        img2Title: 'Protective Case Options',
        img2Sub: 'Style A soft pouch (waterproof charm) / Style B rigid case (holds 2 charms or transit card)',
        img2Badge: 'Guide 2 · Case Add-on',
        img2Tag: 'Soft Pouch / Hard Case',
        img2ModalTitle: 'Guide 2: Case Add-on Reference',
        img2ModalDesc: 'Charm case add-on: Style A soft waterproof pouch (single card, ¥12) / Style B rigid double-sided case (holds 2 or transit card, ¥12)',
        clickZoom: 'Click to view full size',
      },
      item: {
        styleLabel: 'Size & Style',
        styleA: 'Style A (Bookmark)',
        styleAHint: 'CN ≤ 8 / EN ≤ 20',
        styleB: 'Style B (Card)',
        styleBHint: 'CN ≤ 5 / EN ≤ 12',
        contentLabel: 'Text Content (Direct output, no proofreading)',
        weightLabel: (weight, max) => `Weight: ${weight} / ${max}`,
        placeholderA: 'CN ≤ 8 / EN ≤ 15 (1 CN char = 5 EN letters)',
        placeholderB: 'CN ≤ 5 / EN ≤ 12 (1 CN char = 5 EN letters)',
        cnExceed: 'Chinese character limit exceeded',
        enExceed: 'English letter limit exceeded',
        weightExceed: 'Total character weight exceeds visual balance limit',
        illustrationLabel: 'Illustration / Character Description',
        illustrationPlaceholderA: 'Describe up to 2 character actions or specific animal breed & gender.',
        illustrationPlaceholderB: 'Only 1 motif/phrase description, max 2 actions, or specific animal breed & gender.',
        illustrationExceed: 'Description limit exceeded (max 25 characters)',
        styleBReminder: '※ Style B Note: Max 2 action descriptions',
        illustrationDisclaimer: '※ Note: All drawings are artist interpretations in brand style. No pre-shipping previews.',
        caseLabel: 'Add Protective Case (+¥12)',
        caseSubA: 'Soft pouch',
        caseSubB: 'Rigid case (holds 2 cards or transit pass)',
      },
    },
    step3: {
      title: 'Step 3: Contact Information',
      nameLabel: 'Full Name',
      namePlaceholder: 'Recipient full name',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter contact phone number',
      phoneError: 'Invalid phone number digits, please re-enter',
      phonePickupNote: '※ Last 4 digits of phone number verified upon pickup',
      shippingRegionLabel: 'Delivery Destination',
      addressLabel: 'Detailed Shipping Address',
      addressPlaceholder: 'Please enter street, city, province/state, and postal details',
      regions: {
        mainland: 'Mainland China (SF Express Collect)',
        hk: 'Hong Kong (JD Express Collect)',
        overseas: 'Other Overseas Regions (Contact Us)',
      },
      phoneRegions: {
        '+86': '🇨🇳 China (+86)',
        '+852': '🇭🇰 Hong Kong (+852)',
        '+853': '🇲🇴 Macau (+853)',
        '+886': '🇹🇼 Taiwan (+886)',
        '+60': '🇲🇾 Malaysia (+60)',
      },
    },
    step4: {
      successTitle: 'Order Generated Successfully',
      successSubtitle: 'Please review the summary below and download your order receipt',
      receiptHeader: 'Veng Lei Laboratory - Custom Order Receipt',
      pickupMethodLabel: 'Delivery / Pickup',
      pickupMethodShipping: 'Forwarding Service',
      pickupMethodPickup: 'In-Store Pickup (Macau)',
      pickupDateLabel: 'Pickup Date',
      pickupDateVal: (date) => `${date} (8 days after order)`,
      shippingFeeLabel: 'Courier Method',
      shippingFeeVal: 'SF Express Freight Collect (Postage unpaid)',
      contactPersonLabel: 'Contact Name',
      phoneLabel: 'Phone',
      addressLabel: 'Address',
      itemsHeader: (count) => `Order Items (${count} pcs)`,
      colIndex: '#',
      colStyle: 'Style',
      colContent: 'Text',
      colIllustration: 'Illustration',
      colCase: 'Case',
      styleA: 'Style A Bookmark',
      styleB: 'Style B Card',
      hasCaseYes: 'Yes',
      hasCaseNo: 'No',
      totalAmountLabel: 'Total Amount',
      warningBanner: 'No pre-dispatch photos • Download receipt file and submit to WeChat',
      instructionsTitle: 'Submission Instructions:',
      instructionsText: 'Please download the "Order Receipt File" below and send it along with your "Payment Proof Screenshot" to WeChat account: 13718718337. Once payment is confirmed, the artist will begin production!',
    },
    errors: {
      step1Incomplete: 'Please select a pickup/delivery method and agree to the Terms of Service',
      step2ShippingMin2: 'Forwarding service requires at least 2 charms. Please add items or switch to in-store pickup.',
      step2InvalidItems: 'Please ensure all item text and illustration descriptions meet specifications',
      step3IncompleteBasic: 'Please fill in recipient name and a valid contact phone number',
      step3IncompleteShipping: 'Please fill in recipient name, valid phone number, and detailed shipping address',
    },
    receiptFile: {
      title: '[Veng Lei Laboratory - Custom Order Receipt]',
      divider: '--------------------------',
      orderId: 'Order ID',
      date: 'Date',
      pickupMethod: 'Delivery/Pickup',
      pickupMethodShipping: 'Forwarding Service (Macau assisted transit to Zhuhai courier)',
      pickupMethodPickup: 'In-Store Pickup (5D Rua de Afonso de Albuquerque, Macau)',
      pickupDate: (d) => `Pickup Date: ${d} (8 days after order)`,
      shippingFee: 'Courier: SF Express Collect (Freight unpaid)',
      detailsHeader: '[Order Details]',
      itemPrefix: (i) => `[Item ${i}]`,
      style: 'Style',
      content: 'Text',
      illustration: 'Illustration',
      case: 'Protective Case',
      contactHeader: '[Contact Info]',
      recipient: 'Recipient',
      phone: 'Phone',
      address: 'Address',
      total: 'Total Amount',
      tip: 'Note: Please send this file together with payment receipt to WeChat: 13718718337.',
      filename: (id) => `VengLei_CustomOrder_${id}.txt`,
    },
  },
};
