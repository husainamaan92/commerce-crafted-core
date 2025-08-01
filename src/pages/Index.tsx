import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGridWithData } from '@/components/ProductGridWithData';
import { CartSidebar } from '@/components/CartSidebar';
import { AuthModal } from '@/components/AuthModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ProductModal } from '@/components/ProductModal';
import { Product } from '@/types/product';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleShopNowClick = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />
      
      <main>
        <Hero onShopNowClick={handleShopNowClick} />
        
        <section id="products" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated selection of premium products designed to enhance your lifestyle.
              </p>
            </div>
            
            <ProductGridWithData 
              onProductClick={setSelectedProduct}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
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
