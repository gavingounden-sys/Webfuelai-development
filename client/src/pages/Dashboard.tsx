import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Edit3, Eye, Zap, Plus, Settings, Bell, LogOut, Menu, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, loading } = useAuth({ redirectOnUnauthenticated: true });

  // tRPC queries
  const websitesQuery = trpc.websites.list.useQuery();
  const notificationsQuery = trpc.notifications.list.useQuery();
  const createWebsiteMutation = trpc.websites.create.useMutation();

  const websites = websitesQuery.data || [];
  const notifications = notificationsQuery.data || [];

  const stats = [
    { label: "Websites", value: websites.length, icon: Zap },
    { label: "Notifications", value: notifications.filter(n => !n.read).length, icon: Bell },
    { label: "Plan", value: "Starter", icon: Settings }
  ];

  const handleCreateWebsite = async () => {
    try {
      const result = await createWebsiteMutation.mutateAsync({
        businessName: "New Website",
        industry: "Other",
      });
      navigate(`/builder?websiteId=${result.websiteId}`);
    } catch (error) {
      toast.error("Failed to create website");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <nav className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-accent/10 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">i2e Webfuel</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-accent/10 rounded-lg relative">
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              )}
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-border">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-64" : "w-0"} lg:w-64 bg-card border-r border-border transition-all duration-300 overflow-hidden`}>
          <div className="p-6 space-y-6">
            <nav className="space-y-2">
              {[
                { icon: BarChart3, label: "Dashboard", active: true, action: () => {} },
                { icon: Zap, label: "My Websites", action: () => {} },
                { icon: Plus, label: "Create Website", action: handleCreateWebsite },
                { icon: Settings, label: "Settings", action: () => navigate("/domain-settings") },
                { icon: Bell, label: "Notifications", action: () => {} }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                      item.active
                        ? "bg-accent text-white"
                        : "hover:bg-accent/10 text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-border pt-6">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-muted-foreground">Manage your AI-powered websites and track your AVO scores</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <Card key={idx} className="p-6 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Websites Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Websites</h2>
                <Button onClick={handleCreateWebsite} className="bg-accent hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Website
                </Button>
              </div>

              {websitesQuery.isLoading ? (
                <Card className="p-12 border border-border text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                  <p className="text-muted-foreground">Loading websites...</p>
                </Card>
              ) : websites.length === 0 ? (
                <Card className="p-12 border border-border text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No websites yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first AI-powered website to get started</p>
                  <Button onClick={handleCreateWebsite} className="bg-accent hover:bg-accent/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Website
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {websites.map((website) => (
                    <Card key={website.id} className="p-6 border border-border hover:border-accent/50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{website.businessName}</h3>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Status: <span className="capitalize text-foreground">{website.status}</span></span>
                            <span>AVO Score: <span className="text-accent font-semibold">{website.avoScore || 0}</span></span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/builder?websiteId=${website.id}`)}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/generation?websiteId=${website.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
