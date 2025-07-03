import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Camera, Video, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-dark text-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-4">Please log in to view your profile</h2>
            <Button onClick={() => window.location.href = "/"}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="lg:ml-64 min-h-screen pb-16 lg:pb-0">
        {/* Header */}
        <header className="bg-surface border-b border-gray-700 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Profile</h2>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card className="bg-surface">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback className="text-2xl">{user.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                      <h1 className="text-2xl font-bold">{user.displayName}</h1>
                    </div>
                    {user.bio && <p className="text-gray-300 mb-4">{user.bio}</p>}
                    {user.location && (
                      <p className="text-sm text-gray-400 mb-2">📍 {user.location}</p>
                    )}
                    {user.agency && (
                      <p className="text-sm text-gray-400 mb-4">🏢 {user.agency}</p>
                    )}
                    {user.danceStyles && user.danceStyles.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {user.danceStyles.map((style) => (
                          <Badge key={style} variant="secondary">
                            {style}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button className="bg-primary hover:bg-primary/80">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Tabs */}
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="videos" className="flex items-center space-x-2">
                  <Video className="h-4 w-4" />
                  <span>Videos</span>
                </TabsTrigger>
                <TabsTrigger value="headshots" className="flex items-center space-x-2">
                  <Camera className="h-4 w-4" />
                  <span>Headshots</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Events</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="videos" className="mt-6">
                <Card className="bg-surface">
                  <CardContent className="p-6">
                    <div className="text-center py-12 text-gray-400">
                      <Video className="mx-auto h-12 w-12 mb-4" />
                      <p>No videos uploaded yet</p>
                      <Button className="mt-4 bg-primary hover:bg-primary/80">
                        Upload Your First Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="headshots" className="mt-6">
                <Card className="bg-surface">
                  <CardContent className="p-6">
                    <div className="text-center py-12 text-gray-400">
                      <Camera className="mx-auto h-12 w-12 mb-4" />
                      <p>No headshots uploaded yet</p>
                      <Button className="mt-4 bg-primary hover:bg-primary/80">
                        Add Professional Headshots
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="events" className="mt-6">
                <Card className="bg-surface">
                  <CardContent className="p-6">
                    <div className="text-center py-12 text-gray-400">
                      <Calendar className="mx-auto h-12 w-12 mb-4" />
                      <p>No events created yet</p>
                      <Button className="mt-4 bg-primary hover:bg-primary/80">
                        Create Your First Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
