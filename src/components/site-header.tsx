import Link from "next/link";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { Map } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Map className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              YourMapArt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <MainNav />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <UserProfile />
              <ModeToggle />
            </div>
            {/* Mobile Menu */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
