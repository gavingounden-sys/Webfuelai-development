import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Zap, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Support() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: "How long does it take to build my website?",
      answer: "Our AI can generate a complete, optimized website in just minutes. You fill out a simple form, and our system creates your site instantly."
    },
    {
      question: "Can I edit my website after it's generated?",
      answer: "Yes! While we focus on AI-generated sites, you can request edits through our support form and our team will help you customize your site."
    },
    {
      question: "What if I'm not happy with my website?",
      answer: "We want you to be satisfied. If you're not happy with your generated website, contact us and we'll work with you to improve it."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 7-day money-back guarantee if you're not satisfied with our service. No questions asked."
    },
    {
      question: "How do I upgrade my plan?",
      answer: "You can upgrade your plan anytime from your dashboard. The upgrade takes effect immediately, and we'll prorate your billing."
    },
    {
      question: "What happens if I cancel my subscription?",
      answer: "Your website will remain live for 30 days after cancellation. You can reactivate your subscription at any time to restore full access."
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement support ticket submission with tRPC
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Failed to submit support ticket");
    } finally {
      setLoading(false);
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
        </div>
      </nav>

      {/* Header */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-accent/5 to-transparent">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? Our support team is here to help. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 md:py-32">
        <div className="container max-w-2xl">
          <Card className="p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

            {submitted && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                <p className="font-semibold">Thank you for your message!</p>
                <p className="text-sm">We'll get back to you as soon as possible.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-white"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32 bg-card">
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

      {/* CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-accent to-accent/80 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Still have questions?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Our support team is here to help. Send us a message above and we'll respond within 24 hours.
          </p>
        </div>
      </section>
    </div>
  );
}
