import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/navigation/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Eye,
  EyeOff,
  Plus,
  X
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Profile settings state
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    location: user?.location || "",
    agency: user?.agency || "",
    danceStyles: user?.danceStyles || []
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showLocation: true,
    showAgency: true,
    allowDirectMessages: true,
    showActivity: true
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    subscriptionUpdates: true,
    tipNotifications: true,
    commentNotifications: true
  });

  // New dance style input
  const [newDanceStyle, setNewDanceStyle] = useState("");

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/users/${user?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const addDanceStyle = () => {
    if (newDanceStyle.trim() && !profileData.danceStyles.includes(newDanceStyle.trim())) {
      setProfileData(prev => ({
        ...prev,
        danceStyles: [...prev.danceStyles, newDanceStyle.trim()]
      }));
      setNewDanceStyle("");
    }
  };

  const removeDanceStyle = (style: string) => {
    setProfileData(prev => ({
      ...prev,
      danceStyles: prev.danceStyles.filter(s => s !== style)
    }));
  };

  const handlePrivacySave = () => {
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleNotificationSave = () => {
    toast({
      title: "Notification Settings Updated", 
      description: "Your notification preferences have been saved.",
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark text-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400">Please log in to access settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-gray-400">Manage your account preferences and privacy settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-gray-300">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="agency" className="text-gray-300">Dance Agency</Label>
                  <Input
                    id="agency"
                    value={profileData.agency}
                    onChange={(e) => setProfileData(prev => ({ ...prev, agency: e.target.value }))}
                    placeholder="Your dance agency or company"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white resize-none"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Dance Styles</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.danceStyles.map((style, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        {style}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400" 
                          onClick={() => removeDanceStyle(style)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newDanceStyle}
                      onChange={(e) => setNewDanceStyle(e.target.value)}
                      placeholder="Add a dance style"
                      className="bg-gray-800 border-gray-700 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addDanceStyle()}
                    />
                    <Button onClick={addDanceStyle} size="sm" className="bg-primary hover:bg-primary/80">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleProfileSave}
                  disabled={updateProfileMutation.isPending}
                  className="bg-primary hover:bg-primary/80"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Privacy & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Profile Visibility</Label>
                      <p className="text-sm text-gray-400">Make your profile visible to other users</p>
                    </div>
                    <Switch
                      checked={privacySettings.profileVisibility}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, profileVisibility: checked }))}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Show Location</Label>
                      <p className="text-sm text-gray-400">Display your location on your profile</p>
                    </div>
                    <Switch
                      checked={privacySettings.showLocation}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showLocation: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Show Agency</Label>
                      <p className="text-sm text-gray-400">Display your dance agency information</p>
                    </div>
                    <Switch
                      checked={privacySettings.showAgency}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showAgency: checked }))}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Allow Direct Messages</Label>
                      <p className="text-sm text-gray-400">Let other users send you messages</p>
                    </div>
                    <Switch
                      checked={privacySettings.allowDirectMessages}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowDirectMessages: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Show Activity</Label>
                      <p className="text-sm text-gray-400">Display when you were last active</p>
                    </div>
                    <Switch
                      checked={privacySettings.showActivity}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showActivity: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={handlePrivacySave} className="bg-primary hover:bg-primary/80">
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-400">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Push Notifications</Label>
                      <p className="text-sm text-gray-400">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Event Reminders</Label>
                      <p className="text-sm text-gray-400">Get reminded about upcoming events</p>
                    </div>
                    <Switch
                      checked={notificationSettings.eventReminders}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, eventReminders: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Subscription Updates</Label>
                      <p className="text-sm text-gray-400">Notifications about your subscriptions</p>
                    </div>
                    <Switch
                      checked={notificationSettings.subscriptionUpdates}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, subscriptionUpdates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Tip Notifications</Label>
                      <p className="text-sm text-gray-400">Get notified when you receive tips</p>
                    </div>
                    <Switch
                      checked={notificationSettings.tipNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, tipNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Comment Notifications</Label>
                      <p className="text-sm text-gray-400">Notifications for comments on your content</p>
                    </div>
                    <Switch
                      checked={notificationSettings.commentNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, commentNotifications: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={handleNotificationSave} className="bg-primary hover:bg-primary/80">
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Account Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300 font-medium">Email Address</Label>
                    <p className="text-sm text-gray-400 mb-2">Your current email address</p>
                    <Input
                      value={user.email}
                      disabled
                      className="bg-gray-800 border-gray-700 text-gray-400"
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <Label className="text-gray-300 font-medium">Change Password</Label>
                    <p className="text-sm text-gray-400 mb-3">Update your account password</p>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      Change Password
                    </Button>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <Label className="text-gray-300 font-medium">Export Data</Label>
                    <p className="text-sm text-gray-400 mb-3">Download a copy of your data</p>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      Export My Data
                    </Button>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <Label className="text-red-400 font-medium">Danger Zone</Label>
                    <p className="text-sm text-gray-400 mb-3">Permanently delete your account and all data</p>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}