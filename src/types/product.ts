export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price?: number;
  image_url: string;
  category_id: string | null;
  rating: number;
  review_count: number;
  stock_quantity: number;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  // Legacy properties for compatibility
  originalPrice?: number;
  image?: string;
  category?: string;
  reviews?: number;
  inStock?: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  payment_status: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}