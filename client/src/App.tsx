import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Support from "./pages/Support";
import WebsiteBuilder from "./pages/WebsiteBuilder";
import AIGeneration from "./pages/AIGeneration";
import DomainSettings from "./pages/DomainSettings";
import AdminPanel from "./pages/AdminPanel";
import CookieBanner from "./components/CookieBanner";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/auth"} component={Auth} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/support"} component={Support} />
      <Route path={"/builder"} component={WebsiteBuilder} />
      <Route path={"/generation"} component={AIGeneration} />
      <Route path={"/domain-settings"} component={DomainSettings} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/dashboard"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieBanner />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
