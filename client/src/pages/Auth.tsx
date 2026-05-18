import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ArrowRight, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

type AuthStep = "login" | "signup" | "verify" | "reset";

export default function Auth() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<AuthStep>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // TODO: Implement sign up with tRPC
      setSuccess("Account created! Check your email to verify.");
      setStep("verify");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // TODO: Implement login with tRPC
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // TODO: Implement email verification with tRPC
      setSuccess("Email verified! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError("Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // TODO: Implement password reset with tRPC
      setSuccess("Password reset link sent to your email.");
      setTimeout(() => setStep("login"), 3000);
    } catch (err) {
      setError("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">i2e Webfuel</span>
        </div>

        <Card className="p-8 border border-border">
          {/* Login */}
          {step === "login" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground mb-6">Sign in to your account to continue</p>

              {error && <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-sm">{error}</div>}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <button
                onClick={() => setStep("reset")}
                className="text-sm text-accent hover:underline mt-4 w-full text-left"
              >
                Forgot your password?
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Google OAuth
              </Button>

              <p className="text-sm text-muted-foreground text-center mt-6">
                Don't have an account?{" "}
                <button onClick={() => setStep("signup")} className="text-accent hover:underline font-semibold">
                  Sign up
                </button>
              </p>
            </div>
          )}

          {/* Sign Up */}
          {step === "signup" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
              <p className="text-muted-foreground mb-6">Join thousands of South African businesses</p>

              {error && <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-sm">{error}</div>}

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By signing up, you agree to our Terms & Conditions and Privacy Policy
              </p>

              <p className="text-sm text-muted-foreground text-center mt-6">
                Already have an account?{" "}
                <button onClick={() => setStep("login")} className="text-accent hover:underline font-semibold">
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* Email Verification */}
          {step === "verify" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
              <p className="text-muted-foreground mb-6">We've sent a verification code to {email}</p>

              {error && <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-sm">{error}</div>}
              {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{success}</div>}

              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div>
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Email"}
                </Button>
              </form>

              <p className="text-sm text-muted-foreground text-center mt-6">
                Didn't receive the code?{" "}
                <button className="text-accent hover:underline font-semibold">
                  Resend
                </button>
              </p>
            </div>
          )}

          {/* Password Reset */}
          {step === "reset" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
              <p className="text-muted-foreground mb-6">Enter your email and we'll send you a reset link</p>

              {error && <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-sm">{error}</div>}
              {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{success}</div>}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <button
                onClick={() => setStep("login")}
                className="text-sm text-accent hover:underline mt-4 w-full text-left"
              >
                Back to login
              </button>
            </div>
          )}
        </Card>

        {/* Footer */}
        <p className="text-sm text-muted-foreground text-center mt-6">
          Need help? <a href="/support" className="text-accent hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
}
