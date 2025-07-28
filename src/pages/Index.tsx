import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { CartSidebar } from '@/components/CartSidebar';
import { AuthModal } from '@/components/AuthModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ProductModal } from '@/components/ProductModal';
import { products } from '@/data/products';
import { Product } from '@/types/product';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleShopNowClick = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />
      
      <main>
        <Hero onShopNowClick={handleShopNowClick} />
        
        <section id="products" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {selectedCategory === 'All' ? 'Featured Products' : selectedCategory}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated selection of premium products designed to enhance your lifestyle.
              </p>
            </div>
            
            <ProductGrid
              products={filteredProducts}
              onProductClick={setSelectedProduct}
            />
          </div>
        </section>
      </main>

      <CartSidebar onCheckout={() => setIsCheckoutModalOpen(true)} />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
      
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Index;
