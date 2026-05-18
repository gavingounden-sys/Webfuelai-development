import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Search, Check, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function DomainSettings() {
  const [, navigate] = useLocation();
  const [searchDomain, setSearchDomain] = useState("");
  const [clientDomain, setClientDomain] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ available: boolean; price: number } | null>(null);
  const [activeTab, setActiveTab] = useState("provider");

  const handleDomainSearch = async () => {
    if (!searchDomain) return;
    
    setIsSearching(true);
    // Mock search - simulate API call
    setTimeout(() => {
      const isAvailable = Math.random() > 0.3;
      setSearchResult({
        available: isAvailable,
        price: 149 // R149 per year
      });
      setIsSearching(false);
    }, 1500);
  };

  const handlePurchase = () => {
    if (searchResult?.available) {
      // TODO: Integrate with payment gateway
      alert(`Proceeding to checkout for ${searchDomain} (R${searchResult.price}/year)`);
    }
  };

  const handleConnectClientDomain = () => {
    if (clientDomain) {
      // TODO: Integrate with verification process
      alert(`Connecting domain: ${clientDomain}. Please update your DNS records.`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">WebfuelAI</span>
          </button>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <div className="container py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Domain Settings</h1>
        <p className="text-muted-foreground mb-8">Choose how you want to set up your domain</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="provider">Professional Domain (R99/month)</TabsTrigger>
            <TabsTrigger value="client">Use Your Own Domain</TabsTrigger>
          </TabsList>

          {/* Option 1: Provider Domain Search & Purchase */}
          <TabsContent value="provider" className="space-y-6">
            <Card className="p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">Get a Professional Domain</h2>
              <p className="text-muted-foreground mb-6">
                Search for and purchase a professional domain. It's included with your Starter plan at R99/month.
              </p>

              {/* Domain Search */}
              <div className="space-y-4 mb-8">
                <div>
                  <Label htmlFor="search-domain">Search for a domain</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search-domain"
                      placeholder="e.g., johnplumbing"
                      value={searchDomain}
                      onChange={(e) => setSearchDomain(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleDomainSearch()}
                    />
                    <Button
                      onClick={handleDomainSearch}
                      disabled={isSearching || !searchDomain}
                      className="bg-accent hover:bg-accent/90 text-white"
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    We'll search for available domains with .co.za, .com, and other extensions
                  </p>
                </div>

                {/* Search Results */}
                {searchResult && (
                  <div className={`p-4 rounded-lg border-2 ${
                    searchResult.available
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}>
                    <div className="flex items-start gap-3">
                      {searchResult.available ? (
                        <>
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-green-900">
                              {searchDomain}.co.za is available!
                            </p>
                            <p className="text-sm text-green-800 mb-3">
                              R{searchResult.price} per year (R99/month included in your plan)
                            </p>
                            <Button
                              onClick={handlePurchase}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Purchase Domain
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-900">
                              {searchDomain}.co.za is not available
                            </p>
                            <p className="text-sm text-red-800">
                              Try a different name or browse available alternatives
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Included with your plan:</strong> Free domain registration, SSL certificate, and automatic renewal
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Option 2: Client Provides Domain */}
          <TabsContent value="client" className="space-y-6">
            <Card className="p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">Connect Your Own Domain</h2>
              <p className="text-muted-foreground mb-6">
                Already have a domain? Connect it to your WebfuelAI website in 2 simple steps.
              </p>

              {/* Step 1: Enter Domain */}
              <div className="mb-8 pb-8 border-b border-border">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-3">Enter Your Domain</h3>
                    <div>
                      <Label htmlFor="client-domain">Domain Name</Label>
                      <Input
                        id="client-domain"
                        placeholder="example.co.za"
                        value={clientDomain}
                        onChange={(e) => setClientDomain(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter your domain without www (e.g., example.co.za)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Update DNS */}
              <div className="mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-4">Update Your DNS Records</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Log in to your domain registrar (GoDaddy, Namecheap, etc.) and add these DNS records:
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="bg-background border border-border rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 font-semibold">Record Type</p>
                            <code className="font-mono">CNAME</code>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 font-semibold">Value</p>
                            <code className="font-mono text-xs">webfuelai.io</code>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleConnectClientDomain}
                      disabled={!clientDomain}
                      className="bg-accent hover:bg-accent/90 text-white"
                    >
                      Connect Domain
                    </Button>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> DNS changes can take up to 24 hours to propagate. Your website will be live once the DNS is updated.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Current Domain Status */}
        <Card className="p-6 border border-border mt-8 bg-card/50">
          <h3 className="font-semibold mb-4">Current Domain Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Temporary Domain:</span>
              <code className="font-mono text-sm">yoursite.webfuelai.io</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">SSL Certificate:</span>
              <span className="text-sm font-medium">Included</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
