import Link from "next/link";
import Image from "next/image";
import { UserProfile } from "@/components/auth/user-profile";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Left */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="YourMapArt Logo"
              width={200}
              height={134}
              className="h-12 w-auto md:h-14"
              priority
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <MainNav />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <UserProfile />
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
