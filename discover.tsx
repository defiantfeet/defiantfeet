import { Header } from "@/components/navigation/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp } from "lucide-react";

export default function Discover() {
  const trendingStyles = ["Contemporary", "Hip-Hop", "Ballet", "Jazz", "Latin", "Ballroom"];
  
  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Discover</h1>
            <p className="text-gray-400">Explore dance content and find creators to follow</p>
          </div>
          <Button variant="secondary" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search Section */}
        <div className="p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for dancers, styles, or content..."
                className="pl-10 bg-surface border-gray-700 focus:border-primary"
              />
            </div>

            {/* Trending Styles */}
            <div className="bg-surface rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-2 text-secondary" />
                Trending Dance Styles
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingStyles.map((style) => (
                  <Badge
                    key={style}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Featured Content */}
            <div className="bg-surface rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Featured This Week</h3>
              <div className="text-center py-12 text-gray-400">
                <Search className="mx-auto h-12 w-12 mb-4" />
                <p>Start searching to discover amazing dance content!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
