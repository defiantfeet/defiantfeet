import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/navigation/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { Event } from "@shared/schema";
import { Calendar, MapPin, Users, CreditCard, ArrowLeft, Clock } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface EventRegistrationForm {
  fullName: string;
  email: string;
  phone: string;
  danceExperience: string;
  specialRequests?: string;
}

const PaymentForm = ({ 
  event, 
  registrationData, 
  onSuccess 
}: { 
  event: Event; 
  registrationData: EventRegistrationForm;
  onSuccess: () => void;
}) => {
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

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/events?registration=success&event=${event.id}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Payment successful - the redirect will happen automatically
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Registration Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-2">Registration Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Event:</span>
            <span className="text-white">{event.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Name:</span>
            <span className="text-white">{registrationData.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Email:</span>
            <span className="text-white">{registrationData.email}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-gray-700 pt-2">
            <span className="text-gray-300">Total:</span>
            <span className="text-green-400">${event.price}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <PaymentElement />
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-primary hover:bg-primary/80"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Complete Registration - ${event.price}
          </div>
        )}
      </Button>
    </form>
  );
};

export default function EventRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [clientSecret, setClientSecret] = useState("");
  const [registrationData, setRegistrationData] = useState<EventRegistrationForm>({
    fullName: "",
    email: "",
    phone: "",
    danceExperience: "",
    specialRequests: ""
  });

  // Get event ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('eventId');

  const { data: event, isLoading: eventLoading } = useQuery<Event>({
    queryKey: ['/api/events', eventId],
    queryFn: () => 
      fetch(`/api/events/${eventId}`)
        .then(res => {
          if (!res.ok) throw new Error('Event not found');
          return res.json();
        }),
    enabled: !!eventId && eventId !== null,
  });

  const createPaymentIntentMutation = useMutation({
    mutationFn: async (data: { eventId: number; amount: number; registrationData: EventRegistrationForm }) => {
      const response = await apiRequest("POST", "/api/create-event-payment-intent", data);
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setStep('payment');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    // Validate required fields
    if (!registrationData.fullName || !registrationData.email || !registrationData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create payment intent
    createPaymentIntentMutation.mutate({
      eventId: event.id,
      amount: parseFloat(event.price),
      registrationData
    });
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Registration Successful!",
      description: `You're registered for ${event?.title}. Check your email for confirmation.`,
    });
    
    queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    setLocation('/events');
  };

  if (!eventId) {
    return (
      <div className="min-h-screen bg-dark text-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
            <p className="text-gray-400 mb-6">The event you're trying to register for doesn't exist.</p>
            <Button onClick={() => setLocation('/events')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-dark text-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="h-96 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-dark text-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
            <p className="text-gray-400 mb-6">The event you're trying to register for doesn't exist.</p>
            <Button onClick={() => setLocation('/events')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => step === 'payment' ? setStep('details') : setLocation('/events')}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 'payment' ? 'Back to Details' : 'Back to Events'}
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-2">Event Registration</h1>
          <p className="text-gray-400">Register for {event.title}</p>
        </div>

        {/* Event Summary */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <div className="flex items-start gap-4">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <CardTitle className="text-white text-xl mb-2">{event.title}</CardTitle>
                <p className="text-gray-300 mb-3">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.currentParticipants}/{event.maxParticipants} spots
                  </div>
                </div>
                
                <div className="mt-3">
                  <Badge variant="secondary" className="mr-2">
                    {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                  </Badge>
                  <span className="text-green-400 font-semibold text-lg">${event.price}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {step === 'details' && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Registration Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={registrationData.fullName}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={registrationData.phone}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="danceExperience" className="text-gray-300">Dance Experience</Label>
                  <Input
                    id="danceExperience"
                    type="text"
                    placeholder="e.g., Beginner, Intermediate, Advanced"
                    value={registrationData.danceExperience}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, danceExperience: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequests" className="text-gray-300">Special Requests or Notes</Label>
                  <Input
                    id="specialRequests"
                    type="text"
                    placeholder="Any special accommodations or requests..."
                    value={registrationData.specialRequests}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, specialRequests: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/80"
                  disabled={createPaymentIntentMutation.isPending}
                >
                  {createPaymentIntentMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      Continue to Payment - ${event.price}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'payment' && clientSecret && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Complete Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm 
                  event={event} 
                  registrationData={registrationData}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}