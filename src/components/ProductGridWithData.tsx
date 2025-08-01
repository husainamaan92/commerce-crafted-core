import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  searchTerm: string;
  selectedCategory: string;
}

export const ProductGridWithData: React.FC<ProductGridProps> = ({ 
  onProductClick, 
  searchTerm, 
  selectedCategory 
}) => {
  const { products, categories, loading } = useProducts();

  // Get unique categories for filter
  const categoryOptions = useMemo(() => {
    return ['All', ...categories.map(cat => cat.name)];
  }, [categories]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesCategory = selectedCategory === 'All';
      if (!matchesCategory && product.category_id) {
        const category = categories.find(cat => cat.id === product.category_id);
        matchesCategory = category?.name === selectedCategory;
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, products, categories]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Category Filter Display (controlled by Header) */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categoryOptions.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="capitalize"
              disabled
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted/50 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={() => onProductClick(product)}
              />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};