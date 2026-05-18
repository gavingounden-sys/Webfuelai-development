import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40">
      <div className="container py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold mb-2">We use cookies to enhance your experience</p>
          <p className="text-xs text-muted-foreground">
            We use cookies and similar technologies to understand how you use our site and to improve your experience. 
            By continuing to use this site, you agree to our use of cookies. 
            <a href="/privacy" className="text-accent hover:underline ml-1">Learn more</a>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReject}
          >
            Reject
          </Button>
          <Button 
            size="sm"
            className="bg-accent hover:bg-accent/90 text-white"
            onClick={handleAccept}
          >
            Accept All
          </Button>
        </div>
        <button 
          onClick={handleReject}
          className="text-muted-foreground hover:text-foreground transition flex-shrink-0"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
