import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: 99,
      currency: "R",
      period: "/month",
      description: "Perfect for small businesses just getting started",
      features: [
        "1-page website",
        "AVO Lite optimization",
        "Custom domain support",
        "SSL certificate",
        "Email support",
        "Basic analytics"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Growth",
      price: 450,
      currency: "R",
      period: "/month",
      description: "For growing businesses with multiple pages",
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
      ],
      cta: "Get Started",
      highlighted: true
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">i2e Webfuel</span>
          </div>
          <Button 
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Header */}
      <section className="py-20 md:py-32">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Choose the plan that fits your business. All plans include AVO Lite optimization for AI search engines.
          </p>
          <p className="text-sm text-muted-foreground">All prices in South African Rand (ZAR). Billed monthly.</p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 md:py-32 bg-card">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, idx) => (
              <Card 
                key={idx} 
                className={`p-8 border-2 transition-all ${
                  plan.highlighted 
                    ? "border-accent bg-accent/5 relative" 
                    : "border-border hover:border-accent/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">{plan.currency}{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <Button 
                  className={`w-full mb-8 ${
                    plan.highlighted 
                      ? "bg-accent hover:bg-accent/90 text-white" 
                      : "bg-foreground hover:bg-foreground/90 text-background"
                  }`}
                  onClick={() => window.location.href = getLoginUrl()}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes! You can upgrade or downgrade at any time. Changes take effect immediately, and we'll prorate your billing accordingly."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept Paystack (card payments) and PayFast (Instant EFT, SnapScan, Zapper, Mobicred) for South African customers."
              },
              {
                q: "Is there a free trial?",
                a: "Yes! You can build and preview your website for free. You only pay when you're ready to go live."
              },
              {
                q: "What if I need more pages?",
                a: "The Growth plan supports unlimited pages. If you need custom solutions, contact our support team."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 14-day money-back guarantee if you're not satisfied with our service."
              }
            ].map((item, idx) => (
              <div key={idx} className="border-b border-border pb-6 last:border-0">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-accent to-accent/80 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Fuel Your AI Visibility?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Start building your AI-optimized website today. No credit card required.
          </p>
          <Button 
            size="lg"
            className="bg-white text-accent hover:bg-white/90"
            onClick={() => window.location.href = getLoginUrl()}
          >
            Start Free
          </Button>
        </div>
      </section>
    </div>
  );
}
