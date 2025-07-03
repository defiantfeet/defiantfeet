import { Link, useLocation } from "wouter";
import { Home, Search, Dumbbell, Calendar, User } from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Discover", href: "/discover", icon: Search },
  { name: "Training", href: "/training", icon: Dumbbell },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-700 z-50">
      <div className="flex justify-around items-center py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive ? "text-primary" : "text-gray-400"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
