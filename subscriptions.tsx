import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/navigation/header";

interface SubscriptionStats {
  totalSubscribers: number;
  monthlyRevenue: number;
  dailyEarnings: number;
  recentSubscribers: Array<{
    id: string;
    subscribedAt: string;
    amount: number;
  }>;
}

export default function Subscriptions() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<SubscriptionStats>({
    queryKey: ['/api/subscription-stats', user?.id],
    queryFn: () => 
      fetch(`/api/subscription-stats/${user?.id}`)
        .then(res => res.json()),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Please log in to view your subscription stats.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const monthlyAmount = stats?.monthlyRevenue || 0;
  const dailyAmount = stats?.dailyEarnings || 0;
  const subscriberCount = stats?.totalSubscribers || 0;

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Subscription Dashboard</h1>
          <p className="text-gray-400">Track your subscribers and earnings</p>
        </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{subscriberCount}</div>
            <p className="text-xs text-gray-400">
              Active subscribers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${monthlyAmount.toFixed(2)}
            </div>
            <p className="text-xs text-gray-400">
              Recurring monthly income
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Daily Earnings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${dailyAmount.toFixed(2)}
            </div>
            <p className="text-xs text-gray-400">
              Today's earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Subscribers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentSubscribers && stats.recentSubscribers.length > 0 ? (
            <div className="space-y-4">
              {stats.recentSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="text-sm text-gray-300">
                      New subscriber
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-900 text-green-300">
                    +${subscriber.amount.toFixed(2)}/month
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No subscribers yet</p>
              <p className="text-sm text-gray-500">
                Share your content to start building your subscriber base!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earnings Breakdown */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Subscription Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                <span className="text-gray-300">Monthly Subscription</span>
                <Badge variant="outline" className="text-primary border-primary">
                  $9.99/month
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                <span className="text-gray-300">Your Cut (75%)</span>
                <span className="text-green-400 font-semibold">$7.49/month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Conversion Rate</span>
                  <span className="text-sm text-gray-400">Coming Soon</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-0"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Subscriber Growth</span>
                  <span className="text-sm text-gray-400">Coming Soon</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}