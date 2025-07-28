import React, { useEffect } from 'react';
import { CheckCircle, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      toast.success('Payment completed successfully!');
    }
  }, [sessionId]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-success-foreground" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>You'll receive a confirmation email shortly</span>
            </div>
            
            {sessionId && (
              <div className="text-xs text-muted-foreground">
                Order ID: {sessionId.slice(-8)}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleContinueShopping}
              className="w-full"
              variant="accent"
            >
              Continue Shopping
            </Button>
            
            <Button 
              onClick={() => navigate('/orders')}
              variant="outline"
              className="w-full"
            >
              <Package className="w-4 h-4 mr-2" />
              View Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;