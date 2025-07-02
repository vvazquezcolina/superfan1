// Tipos para el sistema de productos de Maké

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: ProductCategory;
  image: string;
  isAvailable: boolean;
  isBestSeller: boolean;
  sizes: ProductSize[];
  flavors: ProductFlavor[];
  colors: ProductColor[];
  decorations: ProductDecoration[];
}

export interface ProductSize {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number; // 1.0 para tamaño base, 1.5 para grande, etc.
}

export interface ProductFlavor {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
  additionalPrice: number;
}

export interface ProductDecoration {
  id: string;
  name: string;
  category: 'flores' | 'mariposas' | 'halloween' | 'bebe' | 'corazones';
  price: number;
}

export type ProductCategory = 
  | 'pasteles'
  | 'cheesecakes' 
  | 'brownies'
  | 'cupcakes'
  | 'trenzas'
  | 'roscas'
  | 'cuchareables'
  | 'temporada';

// Tipos para personalización de productos
export interface ProductCustomization {
  size: ProductSize;
  flavor: ProductFlavor;
  letterColor: ProductColor;
  sprinkleColor: ProductColor;
  decorations: ProductDecoration[];
  customText: CustomText;
}

export interface CustomText {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
}

// Tipos para el carrito de compras
export interface CartItem {
  id: string;
  product: Product;
  customization: ProductCustomization;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Tipos para pedidos y checkout
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  pickupLocation: 'eva-briseno' | 'patria';
  preferredPickupDate: string;
  preferredPickupTime: string;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerInfo: CustomerInfo;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  pickupDate: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

// Tipos para formularios de contacto
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Tipos para newsletter
export interface NewsletterSubscription {
  email: string;
  subscribedAt: Date;
} 