import { Product } from '@/types/product';
import headphonesImage from '@/assets/product-headphones.jpg';
import smartphoneImage from '@/assets/product-smartphone.jpg';
import watchImage from '@/assets/product-watch.jpg';
import laptopImage from '@/assets/product-laptop.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
    price: 299.99,
    originalPrice: 399.99,
    image: headphonesImage,
    category: 'Electronics',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    tags: ['wireless', 'noise-cancelling', 'premium']
  },
  {
    id: '2',
    name: 'Modern Smartphone',
    description: 'Latest generation smartphone with advanced camera system, powerful processor, and stunning display. Stay connected in style.',
    price: 899.99,
    originalPrice: 1099.99,
    image: smartphoneImage,
    category: 'Electronics',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    tags: ['smartphone', 'camera', 'modern']
  },
  {
    id: '3',
    name: 'Luxury Watch',
    description: 'Elegant luxury watch with precision movement and sophisticated design. A perfect blend of style and functionality.',
    price: 1299.99,
    image: watchImage,
    category: 'Accessories',
    rating: 4.7,
    reviews: 67,
    inStock: true,
    tags: ['luxury', 'watch', 'elegant']
  },
  {
    id: '4',
    name: 'Premium Laptop',
    description: 'High-performance laptop for professionals and creators. Featuring powerful processors, stunning display, and premium build quality.',
    price: 1899.99,
    originalPrice: 2199.99,
    image: laptopImage,
    category: 'Electronics',
    rating: 4.9,
    reviews: 156,
    inStock: true,
    tags: ['laptop', 'performance', 'professional']
  },
  {
    id: '5',
    name: 'Wireless Headphones Pro',
    description: 'Professional-grade wireless headphones with studio-quality sound and extended battery life.',
    price: 199.99,
    image: headphonesImage,
    category: 'Electronics',
    rating: 4.6,
    reviews: 203,
    inStock: true,
    tags: ['wireless', 'professional', 'audio']
  },
  {
    id: '6',
    name: 'Smart Watch Elite',
    description: 'Advanced smartwatch with health monitoring, GPS, and premium materials. Your perfect daily companion.',
    price: 599.99,
    image: watchImage,
    category: 'Electronics',
    rating: 4.8,
    reviews: 145,
    inStock: false,
    tags: ['smartwatch', 'health', 'GPS']
  }
];

export const categories = [
  'All',
  'Electronics',
  'Accessories',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors'
];