-- Fix security issue by updating function search path
CREATE OR REPLACE FUNCTION public.delete_order_with_items(order_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
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