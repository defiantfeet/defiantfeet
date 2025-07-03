import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VideoWithUser } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Tip form component that uses Stripe
const TipForm = ({ video, onClose }: { video: VideoWithUser; onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Tip Sent Successfully!",
        description: "Your anonymous tip has been sent to the creator.",
      });
      onClose();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-primary hover:bg-primary/80"
      >
        {isProcessing ? "Processing..." : "Send Anonymous Tip"}
      </Button>
    </form>
  );
};

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoWithUser;
}

export function TipModal({ isOpen, onClose, video }: TipModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("5.00");
  const [clientSecret, setClientSecret] = useState("");

  // Get anonymous ID from localStorage or generate one
  const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
      anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
  };

  const createPaymentIntent = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-tip-payment", {
        amount: parseFloat(amount),
        videoId: video.id,
        anonymousId: getAnonymousId()
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isOpen && amount && parseFloat(amount) >= 0.50) {
      createPaymentIntent();
    }
  }, [isOpen, amount]);

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    setClientSecret(""); // Reset client secret when amount changes
  };

  const quickAmounts = [1, 5, 10, 25];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Send Anonymous Tip</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Video Info */}
          <div className="text-center">
            <h3 className="font-semibold text-lg">{video.title}</h3>
            <p className="text-gray-400">Support {video.user?.displayName}</p>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Amounts</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant={amount === quickAmount.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAmountChange(quickAmount.toString())}
                  className="h-10"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
              Custom Amount (minimum $0.50)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.50"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount"
              className="bg-dark border-gray-600"
            />
          </div>

          {/* Stripe Payment Form */}
          {clientSecret && (
            <div>
              <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <TipForm video={video} onClose={onClose} />
              </Elements>
            </div>
          )}

          {!clientSecret && parseFloat(amount) >= 0.50 && (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-400">Preparing payment...</p>
            </div>
          )}

          {parseFloat(amount) < 0.50 && (
            <p className="text-sm text-yellow-500 text-center">
              Minimum tip amount is $0.50
            </p>
          )}

          {/* Anonymous Notice */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              🔒 Your tip is completely anonymous. The creator will not see your identity.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}