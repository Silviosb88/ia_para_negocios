import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Moderation from "./pages/Moderation";
import Profile from "./pages/Profile";
import ContentManager from "./pages/ContentManager";

function Router() {
  // Dashboard and other admin routes require authentication
  // Upload, Moderation, and Profile routes are protected by their own components
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/upload"} component={Upload} />
      <Route path={"/moderation"} component={Moderation} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/content-manager"} component={ContentManager} />
      <Route path={"/docs"} component={Docs} />
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
