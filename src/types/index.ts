export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  salePrice?: number;
  saleEndsAt?: string;
  category: Category;
  variants: Variant[];
  finishes: Finish[];
  dimensions: Dimensions;
  material: string;
  careInstructions: string;
  images: string[];
  featured: boolean;
  inStock: boolean;
  stockCount: number;
  sku: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  /** Category slugs this product's bundle already covers (e.g. a full
   * bedroom set covering beds/wardrobes/dressing-tables/side-tables) — used
   * to avoid suggesting "add a bed" on a page/cart that already has one via
   * a bundle SKU, not as a separate line item. */
  bundleCoversCategories?: string[];
}

export interface Variant {
  _id: string;
  name: string;
  sku: string;
  size: string;
  priceModifier: number;
  inStock: boolean;
  stockCount: number;
  variantImages: string[];
}

export interface Finish {
  _id: string;
  name: string;
  color: string;
  colorCode: string;
  priceModifier: number;
  images: string[];
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
  unit: "cm" | "in";
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Order {
  _id: string;
  orderRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentScreenshot?: string;
  deliveryAddress?: string;
  deliveryType: "deliver" | "collect";
  deliveryArea?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface OrderItem {
  product: Product;
  variant?: Variant;
  finish?: Finish;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "building"
  | "quality_check"
  | "ready"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "advance_paid"
  | "partial_paid"
  | "fully_paid"
  | "refunded";

export type PaymentMethod = "bank" | "easypaisa" | "cash";

export interface Wishlist {
  _id: string;
  items: WishlistItem[];
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  product: Product;
  variant?: Variant;
  finish?: Finish;
  addedAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  author: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  eventType: string;
  sessionId: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface Coupon {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
}

export interface Affiliate {
  _id: string;
  name: string;
  code: string;
  phone: string;
  email?: string;
  commissionRate: number;
  totalSales: number;
  totalCommission: number;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  variant?: Variant;
  finish?: Finish;
  quantity: number;
}
