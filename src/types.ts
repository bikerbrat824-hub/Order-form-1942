export type PickupMethod = 'shipping' | 'pickup';
export type ItemStyle = 'A' | 'B';
export type SupportedLanguage = 'zh-TW' | 'zh-CN' | 'en';

export interface OrderItem {
  id: string;
  style: ItemStyle;
  content: string;
  illustration: string;
  hasCase: boolean;
}

export interface ContactInfo {
  name: string;
  phone: string;
  phoneRegion: string;
  shippingRegion: string;
  address?: string;
}

export interface OrderData {
  pickupMethod: PickupMethod | null;
  items: OrderItem[];
  contact: ContactInfo;
  agreedToTerms: boolean;
}
