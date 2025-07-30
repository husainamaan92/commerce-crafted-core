import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Trash2, Package, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  shipping_address: string;
  order_items: OrderItem[];
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const defaultTab = searchParams.get('tab') === 'orders' ? 'orders' : 'profile';

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          payment_status,
          created_at,
          shipping_address,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          email: user?.email || '',
          avatar_url: publicUrl,
          full_name: profile?.full_name || user?.user_metadata?.full_name || '',
        });

      if (updateError) {
        throw updateError;
      }

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      toast.error('Error uploading avatar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase.rpc('delete_order_with_items', {
        order_id_param: orderId
      });

      if (error) {
        throw error;
      }

      setOrders(orders.filter(order => order.id !== orderId));
      toast.success('Order deleted successfully!');
    } catch (error: any) {
      toast.error('Error deleting order: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your profile picture and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={profile?.avatar_url || user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                    alt={profile?.full_name || user.email} 
                  />
                  <AvatarFallback>
                    {(profile?.full_name || user.email).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" disabled={uploading} asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Change Picture'}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile?.full_name || user.user_metadata?.full_name || 'Not set'}
                  </p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile?.phone || 'Not set'}
                  </p>
                </div>
                <div>
                  <Label>City</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile?.city || 'Not set'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Your Orders
              </CardTitle>
              <CardDescription>
                View and manage your order history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No orders found. Start shopping to see your orders here!
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <Badge variant="outline">
                                {order.payment_status}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(order.created_at), 'PPP')}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CreditCard className="h-4 w-4 mr-1" />
                              ₹{order.total_amount}
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteOrder(order.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-3">
                          <h4 className="font-medium">Items</h4>
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                              <img
                                src={item.products.image_url}
                                alt={item.products.name}
                                className="h-12 w-12 rounded object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.products.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity} × ₹{item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.shipping_address && (
                          <>
                            <Separator className="my-4" />
                            <div>
                              <h4 className="font-medium mb-2">Shipping Address</h4>
                              <p className="text-sm text-muted-foreground">
                                {order.shipping_address}
                              </p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}