import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Zap, Globe, BarChart3, MessageCircle, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Landing() {
  const [, navigate] = useLocation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { user } = useAuth();

  // Landing page is accessible to all users (logged in or not)

  const faqItems = [
    {
      question: "What is AVO Lite (AI Visibility Optimisation)?",
      answer: "AVO Lite is our proprietary optimization layer that ensures every website we build appears in AI search engines like ChatGPT, Perplexity, and Google AI Overview—not just traditional Google search. It includes AI-friendly robots.txt, llms.txt, schema markup, and optimized copy."
    },
    {
      question: "Do I need technical skills to use WebfuelAI?",
      answer: "No technical skills required! Our AI-powered builder guides you through a simple form, and our AI engine handles all the heavy lifting. Just answer questions about your business, and we'll create an optimized website for you."
    },
    {
      question: "Can I use my own domain?",
      answer: "Yes! You can use a free subdomain (businessname.webfuelai.co.za) or connect your own custom domain. We provide step-by-step DNS instructions to make it easy."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Paystack (card payments) and PayFast (Instant EFT, SnapScan, Zapper, Mobicred) for South African customers. All payments are in South African Rand (ZAR)."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly."
    },
    {
      question: "Is my data secure and POPIA compliant?",
      answer: "Yes. We're fully POPIA compliant and use industry-standard encryption to protect your data. We never share your information with third parties without your consent."
    }
  ];

  const testimonials = [
    {
      name: "Thabo Mkhize",
      business: "TM Plumbing Services",
      quote: "WebfuelAI helped us go from having no online presence to ranking in AI search results within weeks. Our phone hasn't stopped ringing!",
      avatar: "TM"
    },
    {
      name: "Naledi Dlamini",
      business: "Naledi's Boutique",
      quote: "The process was so simple. I filled in a form about my business, and the AI created a beautiful website that actually converts customers.",
      avatar: "ND"
    },
    {
      name: "Sipho Nkosi",
      business: "Nkosi Consulting",
      quote: "Finally, a website builder designed for South African businesses. The Paystack integration and local support are exactly what we needed.",
      avatar: "SN"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663487203422/DC43JupwqdpwmdwGRZxPUx/WebfuelLOGO-hires_9af9b916.png" alt="WebfuelAI Logo" className="h-10" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm hover:text-accent transition">How It Works</a>
            <a href="#features" className="text-sm hover:text-accent transition">Features</a>
            <a href="#pricing" className="text-sm hover:text-accent transition">Pricing</a>
            <a href="#faq" className="text-sm hover:text-accent transition">FAQ</a>
          </div>
          <Button 
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663487203422/DC43JupwqdpwmdwGRZxPUx/AVOLOGO-new_5514e967.png" alt="AVO Logo" className="h-12" />
              <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                <span className="text-sm font-medium text-accent">Fuel Your AI Visibility</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              AI-Powered Websites Built for <span className="text-accent">AI Search</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get found on ChatGPT, Perplexity and Google AI Overview and other LLMs. Build your AI Visibility optimised website in minutes. No coding. No designers. Just your business details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Build My Free Website <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-card">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Fill in Your Info", description: "Answer simple questions about your business, services, and brand preferences." },
              { step: "2", title: "AI Creates Your Site", description: "Our AI generates optimized copy, design, and AVO Lite strategy" },
              { step: "3", title: "Go Live", description: "Review, approve, and launch. Your site is instantly optimized for AI search engines." }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-8">
                    <ArrowRight className="w-full h-full text-accent/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose WebfuelAI?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Globe, title: "Every site includes AVO Lite built to be easily understood by AI assistants like ChatGPT, Perplexity and Google AI Overview.", description: "Every site includes AVO Lite built to be easily understood by AI assistants like ChatGPT, Perplexity and Google AI Overview." },
              { icon: Zap, title: "Built in Minutes", description: "No coding, no design experience needed. Our AI handles everything from copy generation to layout design." },
              { icon: BarChart3, title: "AVO Score Dashboard", description: "Track how well your site is optimized for AI visibility with our real-time AVO Score widget." },
              { icon: MessageCircle, title: "South African Focus", description: "Built in South Africa, for South Africa. Pay via Paystack or PayFast. Priced in Rands. No surprises" },
              { icon: Mail, title: "Email Verification", description: "Secure authentication with email verification and password reset flows." },
              { icon: Phone, title: "Custom Domains", description: "Use a free subdomain or connect your own custom domain with step-by-step DNS instructions." }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-6 border border-border hover:border-accent/50 transition">
                  <Icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-card">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-6 border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqItems.map((item, idx) => (
              <Card key={idx} className="border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/5 transition"
                >
                  <h3 className="font-semibold text-left">{item.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-accent transition-transform ${expandedFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 py-4 border-t border-border bg-card/50">
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-accent to-accent/80 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Fuel Your AI Visibility?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of South African businesses already ranking in AI search engines. Start building your free website today.
          </p>
          <Button 
            size="lg"
            className="bg-white text-accent hover:bg-white/90"
            onClick={() => window.location.href = getLoginUrl()}
          >
            Build My Free Website <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">WebfuelAI</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered websites optimized for ChatGPT, Perplexity, and Google AI Overview.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-accent transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-accent transition">Pricing</a></li>
                <li><a href="#faq" className="hover:text-accent transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/support" className="hover:text-accent transition">Support</a></li>
                <li><a href="/privacy" className="hover:text-accent transition">Privacy</a></li>
                <li><a href="/terms" className="hover:text-accent transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <Facebook className="w-5 h-5 text-muted-foreground hover:text-accent cursor-pointer transition" />
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-accent cursor-pointer transition" />
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-accent cursor-pointer transition" />
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 WebfuelAI. All rights reserved.</p>
            <p>Built in South Africa, for South Africa 🇿🇦</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
