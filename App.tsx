import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Home from "@/pages/home";
import Discover from "@/pages/discover";
import Create from "@/pages/create";
import Editing from "@/pages/editing";
import Headshots from "@/pages/headshots";
import Events from "@/pages/events";
import Training from "@/pages/training";
import Newsletter from "@/pages/newsletter";
import Profile from "@/pages/profile";
import Subscriptions from "@/pages/subscriptions";
import Settings from "@/pages/settings";
import EventRegister from "@/pages/event-register";
import AutoLogin from "@/pages/auto-login";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/create" component={Create} />
      <Route path="/editing" component={Editing} />
      <Route path="/headshots" component={Headshots} />
      <Route path="/events" component={Events} />
      <Route path="/event-register" component={EventRegister} />
      <Route path="/training" component={Training} />
      <Route path="/newsletter" component={Newsletter} />
      <Route path="/profile" component={Profile} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/settings" component={Settings} />
      <Route path="/login" component={Login} />
      <Route path="/auto-login" component={AutoLogin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Apply dark class to document element
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="dark min-h-screen bg-background text-foreground">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
