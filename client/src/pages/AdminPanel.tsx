import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Users, Globe, TrendingUp, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminPanel() {
  const [, navigate] = useLocation();
  const [searchUsers, setSearchUsers] = useState("");
  const [searchWebsites, setSearchWebsites] = useState("");

  // Mock data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", plan: "starter", status: "active", joinedAt: "2026-03-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", plan: "growth", status: "active", joinedAt: "2026-03-10" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", plan: "free", status: "inactive", joinedAt: "2026-02-20" }
  ];

  const websites = [
    { id: 1, businessName: "John's Plumbing", owner: "John Doe", status: "live", avoScore: 78, createdAt: "2026-03-15" },
    { id: 2, businessName: "Jane's Boutique", owner: "Jane Smith", status: "live", avoScore: 85, createdAt: "2026-03-10" },
    { id: 3, businessName: "Bob's Consulting", owner: "Bob Wilson", status: "draft", avoScore: 0, createdAt: "2026-02-20" }
  ];

  const stats = [
    { label: "Total Users", value: "3", icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Live Websites", value: "2", icon: Globe, color: "bg-green-50 text-green-600" },
    { label: "Total Revenue", value: "R549", icon: TrendingUp, color: "bg-accent/10 text-accent" }
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const filteredWebsites = websites.filter(w =>
    w.businessName.toLowerCase().includes(searchWebsites.toLowerCase()) ||
    w.owner.toLowerCase().includes(searchWebsites.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">i2e Webfuel Admin</span>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Exit Admin
          </Button>
        </div>
      </nav>

      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage users, websites, and platform analytics</p>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-6 border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="websites">Websites</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <Button className="bg-accent hover:bg-accent/90 text-white">
                  Add User
                </Button>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchUsers}
                    onChange={(e) => setSearchUsers(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b border-border hover:bg-accent/5 transition">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-semibold capitalize">
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                            user.status === "active" 
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-700"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{user.joinedAt}</td>
                        <td className="py-3 px-4">
                          <button className="p-2 hover:bg-accent/10 rounded-lg transition">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Websites Tab */}
          <TabsContent value="websites" className="space-y-6">
            <Card className="p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Website Management</h2>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by business name or owner..."
                    value={searchWebsites}
                    onChange={(e) => setSearchWebsites(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredWebsites.map(website => (
                  <Card key={website.id} className="p-4 border border-border hover:border-accent/50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{website.businessName}</h3>
                        <p className="text-sm text-muted-foreground mb-3">Owner: {website.owner}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${website.status === "live" ? "bg-green-500" : "bg-yellow-500"}`} />
                            <span className="capitalize">{website.status}</span>
                          </div>
                          <div>AVO Score: {website.avoScore}/100</div>
                          <div className="text-muted-foreground">Created: {website.createdAt}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-accent/10 rounded-lg transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-destructive/10 rounded-lg transition">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Revenue Overview</h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "This Month", value: "R549", change: "+12%" },
                  { label: "Total Revenue", value: "R1,098", change: "+8%" },
                  { label: "Active Subscriptions", value: "2", change: "+1" }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs text-green-600 mt-2">{item.change}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-4">Recent Payments</h3>
                <div className="space-y-3">
                  {[
                    { user: "Jane Smith", amount: "R450", date: "2026-04-01", status: "completed" },
                    { user: "John Doe", amount: "R99", date: "2026-03-15", status: "completed" }
                  ].map((payment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">{payment.user}</p>
                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{payment.amount}</p>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded capitalize">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
