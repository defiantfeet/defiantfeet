import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Search, Plus, Calendar, User, Bell, Edit3, Dumbbell, CreditCard, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/discover", icon: Search, label: "Discover" },
    { href: "/training", icon: Dumbbell, label: "Training" },
    { href: "/create", icon: Plus, label: "Create" },
    { href: "/editing", icon: Edit3, label: "Editing" },
    { href: "/events", icon: Calendar, label: "Events" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/subscriptions", icon: CreditCard, label: "Subscriptions" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-dark/95 backdrop-blur supports-[backdrop-filter]:bg-dark/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - Hamburger Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-dark border-gray-800">
            <div className="flex flex-col space-y-4 mt-8">
              <div className="px-2">
                <h2 className="text-lg font-bold text-primary mb-6">DefiantFeet</h2>
              </div>
              
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left ${
                          isActive(item.href)
                            ? "bg-primary/20 text-primary"
                            : "text-gray-300 hover:text-white hover:bg-gray-800"
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>

              {user && (
                <div className="pt-6 border-t border-gray-800">
                  <div className="px-2">
                    <p className="text-sm font-medium text-white">{user.displayName}</p>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Center - Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-primary">DefiantFeet</h1>
          </div>
        </Link>

        {/* Right side - Notifications */}
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}