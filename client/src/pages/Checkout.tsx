import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Check, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Checkout() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "growth">("growth");
  const [selectedGateway, setSelectedGateway] = useState<"paystack" | "payfast">("paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse websiteId from URL
  const params = new URLSearchParams(search);
  const websiteId = params.get("websiteId") ? parseInt(params.get("websiteId")!) : null;

  const plans = {
    starter: {
      name: "Starter",
      price: 99,
      currency: "R",
      description: "1-page website with AVO Lite optimization",
      features: [
        "1-page website",
        "AVO Lite optimization",
        "Custom domain support",
        "SSL certificate",
        "Email support",
        "Basic analytics"
      ]
    },
    growth: {
      name: "Growth",
      price: 450,
      currency: "R",
      description: "Multi-page website with advanced features",
      features: [
        "Multi-page website",
        "AVO Lite optimization",
        "Custom domain support",
        "SSL certificate",
        "Priority email support",
        "Advanced analytics",
        "Blog functionality",
        "Contact forms",
        "Monthly updates"
      ]
    }
  };

  // tRPC mutation for payment initiation
  const initiatePaymentMutation = trpc.payments.initiatePayment.useMutation({
    onSuccess: (result) => {
      if (result.redirectUrl) {
        // Redirect to payment gateway
        window.location.href = result.redirectUrl;
      }
    },
    onError: (error) => {
      console.error("Payment error:", error);
      setError(error.message || "Failed to initiate payment");
      setIsProcessing(false);
      toast.error(error.message || "Failed to initiate payment");
    },
  });

  useEffect(() => {
    if (!websiteId) {
      setError("Website ID not found");
    }
  }, [websiteId]);

  const handlePayment = async () => {
    if (!websiteId) {
      setError("Website ID not found");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const amount = selectedPlan === "starter" ? 99 : 450;

      await initiatePaymentMutation.mutateAsync({
        websiteId,
        amount,
        gateway: selectedGateway,
      });
    } catch (err) {
      console.error("Payment initiation error:", err);
      setIsProcessing(false);
    }
  };

  const currentPlan = plans[selectedPlan];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">WebfuelAI</span>
          </div>
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
            Back
          </button>
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete Your Purchase</h1>
            <p className="text-muted-foreground">
              Choose your plan and payment method to go live with your AI-optimized website.
            </p>
          </div>

          {error && (
            <Card className="p-4 mb-8 border-red-500/50 bg-red-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-500">Error</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan Selection */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {/* Plan Cards */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Select Your Plan</h2>
                  <div className="grid gap-4">
                    {Object.entries(plans).map(([key, plan]) => (
                      <Card
                        key={key}
                        className={`p-6 border-2 cursor-pointer transition ${
                          selectedPlan === key
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        }`}
                        onClick={() => setSelectedPlan(key as "starter" | "growth")}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold">{plan.name}</h3>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {plan.currency}{plan.price}
                            </div>
                            <div className="text-xs text-muted-foreground">/month</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                  <div className="grid gap-4">
                    <Card
                      className={`p-4 border-2 cursor-pointer transition ${
                        selectedGateway === "paystack"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                      onClick={() => setSelectedGateway("paystack")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedGateway === "paystack"
                            ? "border-accent bg-accent"
                            : "border-border"
                        }`} />
                        <div>
                          <h3 className="font-semibold">Paystack</h3>
                          <p className="text-sm text-muted-foreground">Credit/Debit Card</p>
                        </div>
                      </div>
                    </Card>

                    <Card
                      className={`p-4 border-2 cursor-pointer transition ${
                        selectedGateway === "payfast"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                      onClick={() => setSelectedGateway("payfast")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedGateway === "payfast"
                            ? "border-accent bg-accent"
                            : "border-border"
                        }`} />
                        <div>
                          <h3 className="font-semibold">PayFast</h3>
                          <p className="text-sm text-muted-foreground">Instant EFT, SnapScan, Zapper, Mobicred</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Terms */}
                <Card className="p-4 bg-muted/50 border-border">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">14-day money-back guarantee</p>
                      <p className="text-muted-foreground">
                        Not satisfied? Get a full refund within 14 days of purchase.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 border-border sticky top-24">
                <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{currentPlan.name} Plan</span>
                    <span className="font-semibold">{currentPlan.currency}{currentPlan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing Period</span>
                    <span className="font-semibold">Monthly</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold text-accent">{currentPlan.currency}{currentPlan.price}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !websiteId}
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Pay Now
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Your payment is secure and encrypted.
                </p>

                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-3 text-sm">Plan Features</h3>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
