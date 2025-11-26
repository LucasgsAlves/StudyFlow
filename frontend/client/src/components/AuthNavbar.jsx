import { Home, Github } from "lucide-react";
import { useLocation } from "wouter";

export default function AuthNavbar() {
  const [, setLocation] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">Voltar para Home</span>
        </button>
        
        <a
          href="https://github.com/LucasgsAlves"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <Github className="h-5 w-5" />
          <span className="font-medium hidden sm:inline">GitHub</span>
        </a>
      </div>
    </nav>
  );
}
