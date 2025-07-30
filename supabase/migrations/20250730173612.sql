-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policies for avatar uploads
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add delete policy for orders
CREATE POLICY "Users can delete their own orders" 
ON public.orders 
FOR DELETE 
USING (user_id = auth.uid());

-- Add delete policy for order_items
CREATE POLICY "Users can delete order items for their orders" 
ON public.order_items 
FOR DELETE 
USING (EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = order_items.order_id) AND (orders.user_id = auth.uid()))));

-- Create function to delete order with all items
CREATE OR REPLACE FUNCTION public.delete_order_with_items(order_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the order belongs to the current user
  IF NOT EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id_param AND user_id = auth.uid()
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Delete order items first
  DELETE FROM public.order_items WHERE order_id = order_id_param;
  
  -- Delete the order
  DELETE FROM public.orders WHERE id = order_id_param;
  
  RETURN TRUE;
END;
$$;