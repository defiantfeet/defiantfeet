import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock, Star, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Subscription form component that uses Stripe
const SubscriptionForm = ({ creatorName, onClose }: { creatorName: string; onClose: () => void }) => {
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
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successfully Subscribed!",
        description: `You're now subscribed to ${creatorName}'s exclusive content.`,
      });
      onClose();
      window.location.reload(); // Refresh to show subscription content
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
        {isProcessing ? "Processing..." : `Subscribe for $9.99/month`}
      </Button>
    </form>
  );
};

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: number;
  creatorName: string;
}

export function SubscriptionModal({ isOpen, onClose, creatorId, creatorName }: SubscriptionModalProps) {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);

  // Get anonymous ID from localStorage or generate one
  const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
      anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
  };

  // Check if already subscribed
  const checkSubscriptionStatus = async () => {
    try {
      const response = await apiRequest("GET", `/api/subscription-status/${creatorId}/${getAnonymousId()}`);
      const data = await response.json();
      setIsAlreadySubscribed(data.hasSubscription);
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };

  // Create subscription
  const createSubscription = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-subscription", {
        creatorId,
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
    if (isOpen) {
      checkSubscriptionStatus();
      if (!isAlreadySubscribed) {
        createSubscription();
      }
    }
  }, [isOpen, creatorId]);

  const subscriptionBenefits = [
    "Access to exclusive premium videos",
    "Early access to new content",
    "Behind-the-scenes footage",
    "Monthly Q&A sessions",
    "Exclusive dance tutorials"
  ];

  if (isAlreadySubscribed) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-surface border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Already Subscribed
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">You're subscribed to {creatorName}</h3>
            <p className="text-gray-400 mb-6">
              You have access to all their exclusive content. Enjoy!
            </p>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/80">
              Continue Watching
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Subscribe to {creatorName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Premium Badge */}
          <div className="text-center">
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Premium Content
            </Badge>
          </div>

          {/* Locked Content Notice */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Exclusive Content</h3>
            <p className="text-sm text-gray-400">
              This video is only available to subscribers of {creatorName}
            </p>
          </div>

          {/* Subscription Benefits */}
          <div>
            <h4 className="font-semibold mb-3 text-center">What you'll get:</h4>
            <div className="space-y-2">
              {subscriptionBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">$9.99</div>
            <div className="text-sm text-gray-400">per month</div>
            <div className="text-xs text-gray-500 mt-1">Cancel anytime</div>
          </div>

          {/* Stripe Payment Form */}
          {clientSecret && (
            <div>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscriptionForm creatorName={creatorName} onClose={onClose} />
              </Elements>
            </div>
          )}

          {!clientSecret && (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-400">Preparing subscription...</p>
            </div>
          )}

          {/* Anonymous Notice */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              🔒 Your subscription is completely anonymous. The creator will not see your identity.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}