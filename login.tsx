import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    email: "",
    displayName: "",
    password: "",
    confirmPassword: "",
    bio: "",
    location: "",
    agency: "",
    danceStyles: [] as string[]
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
  const popularDanceStyles = [
    "Hip-Hop", "Contemporary", "Ballet", "Jazz", "Tap", "Latin", 
    "Ballroom", "Breakdancing", "Salsa", "Swing", "Modern", "Lyrical"
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to DefiantFeet"
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    try {
      const userData = {
        email: registerData.email,
        displayName: registerData.displayName,
        password: registerData.password,
        bio: registerData.bio || undefined,
        location: registerData.location || undefined,
        agency: registerData.agency || undefined,
        danceStyles: registerData.danceStyles.length > 0 ? registerData.danceStyles : undefined
      };
      
      await register(userData);
      toast({
        title: "Welcome to DefiantFeet!",
        description: "Your account has been created successfully"
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    }
  };

  const toggleDanceStyle = (style: string) => {
    setRegisterData(prev => ({
      ...prev,
      danceStyles: prev.danceStyles.includes(style)
        ? prev.danceStyles.filter(s => s !== style)
        : [...prev.danceStyles, style]
    }));
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-surface border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">DefiantFeet</CardTitle>
          <CardDescription className="text-gray-400">
            Join the dance community
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bg-dark border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="bg-dark border-gray-600 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/80"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-dark border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-displayName">Display Name</Label>
                  <Input
                    id="register-displayName"
                    type="text"
                    placeholder="Your full name"
                    value={registerData.displayName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, displayName: e.target.value }))}
                    required
                    className="bg-dark border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="bg-dark border-gray-600 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-confirmPassword">Confirm Password</Label>
                  <Input
                    id="register-confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    className="bg-dark border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-bio">Bio (Optional)</Label>
                  <Input
                    id="register-bio"
                    type="text"
                    placeholder="Tell us about yourself"
                    value={registerData.bio}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-dark border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-location">Location (Optional)</Label>
                  <Input
                    id="register-location"
                    type="text"
                    placeholder="City, Country"
                    value={registerData.location}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-dark border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-agency">Dance Agency (Optional)</Label>
                  <Input
                    id="register-agency"
                    type="text"
                    placeholder="Agency or Company Name"
                    value={registerData.agency}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, agency: e.target.value }))}
                    className="bg-dark border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Dance Styles (Optional)</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {popularDanceStyles.map((style) => (
                      <Button
                        key={style}
                        type="button"
                        variant={registerData.danceStyles.includes(style) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleDanceStyle(style)}
                        className="text-xs h-7"
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/80"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}