import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

interface HeroProps {
  onShopNowClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNowClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="flex items-center space-x-2 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
              <span className="text-sm font-medium">Trusted by 10,000+ customers</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                Discover Premium
                <span className="bg-gradient-accent bg-clip-text text-transparent block">
                  Quality Products
                </span>
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-md">
                Explore our curated collection of premium electronics, accessories, and lifestyle products. 
                Quality guaranteed with fast, free shipping.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="accent" 
                size="xl"
                onClick={onShopNowClick}
                className="group"
              >
                Shop Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                View Collection
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">50K+</div>
                <div className="text-sm text-primary-foreground/60">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">1000+</div>
                <div className="text-sm text-primary-foreground/60">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">99%</div>
                <div className="text-sm text-primary-foreground/60">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-hero">
              <img
                src={heroBanner}
                alt="Premium Products"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-accent text-accent-foreground rounded-full p-6 shadow-cart">
              <div className="text-center">
                <div className="text-2xl font-bold">25%</div>
                <div className="text-xs">OFF</div>
              </div>
            </div>
            
            {/* Floating Review */}
            <div className="absolute -bottom-4 -left-4 bg-background rounded-lg p-4 shadow-cart max-w-xs">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5</span>
              </div>
              <p className="text-sm text-muted-foreground">
                "Amazing quality and fast shipping!"
              </p>
              <p className="text-xs text-muted-foreground mt-1">- Sarah M.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};