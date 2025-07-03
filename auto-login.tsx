import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AutoLogin() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        // Create a new test account with the updated schema
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "sarah.dancer@example.com",
            displayName: "Sarah Chen",
            password: "dance123",
            bio: "Professional contemporary dancer and choreographer specializing in fusion styles.",
            location: "New York City, NY",
            agency: "Metropolitan Dance Company",
            danceStyles: ["Contemporary", "Jazz", "Hip-Hop", "Modern"]
          })
        });
        
        if (registerResponse.status === 400) {
          // User already exists, just login
          await login("sarah.dancer@example.com", "dance123");
        } else {
          // New user created, login with the new account
          await login("sarah.dancer@example.com", "dance123");
        }
        
        toast({
          title: "Logged in as Sarah Chen",
          description: "Viewing test dancer profile"
        });
        setLocation("/profile");
      } catch (error: any) {
        toast({
          title: "Auto-login failed",
          description: error.message,
          variant: "destructive"
        });
        setLocation("/");
      }
    };

    autoLogin();
  }, [login, setLocation, toast]);

  return (
    <div className="min-h-screen bg-dark text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-400">Logging in as test dancer...</p>
      </div>
    </div>
  );
}