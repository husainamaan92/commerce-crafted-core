import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const originalPrice = product.originalPrice || product.original_price;
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <div 
      className="group cursor-pointer bg-card rounded-lg shadow-product hover:shadow-cart transition-all duration-300 overflow-hidden border border-border/50 hover:border-primary/20"
      onClick={() => onProductClick(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image || product.image_url}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{discountPercentage}%
            </Badge>
          )}
          {(product.inStock === false || (product.stock_quantity !== undefined && product.stock_quantity <= 0)) && (
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Quick Add to Cart - appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="cart"
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.inStock === false || (product.stock_quantity !== undefined && product.stock_quantity <= 0)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {(product.inStock !== false && (product.stock_quantity === undefined || product.stock_quantity > 0)) ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Category and Rating */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {product.category || 'General'}
          </Badge>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews || product.review_count})</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};