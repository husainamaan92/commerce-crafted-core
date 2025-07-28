import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { toast } from 'sonner';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match legacy interface
      const transformedProducts = data?.map(product => ({
        ...product,
        image: product.image_url,
        originalPrice: product.original_price,
        reviews: product.review_count,
        inStock: product.stock_quantity > 0,
        isFeatured: product.featured,
        category: product.category_id,
      })) || [];

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    products,
    categories,
    loading,
    refetch: () => {
      fetchProducts();
      fetchCategories();
    }
  };
};