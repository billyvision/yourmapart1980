"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Home, Map, Palette, LogIn, LayoutDashboard, Shield, Menu, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { UserProfile } from "./auth/user-profile";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const publicNavItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Templates",
      href: "/mpg-templates",
      icon: Map,
    },
    {
      title: "Map Studio",
      href: "/mpg",
      icon: Palette,
    },
  ];

  // No auth nav items - Dashboard is now in dropdown only
  const authNavItems: typeof publicNavItems = [];

  const allNavItems = [...publicNavItems, ...authNavItems];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-gray-300 hover:bg-gray-800">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-6">
          {/* User Profile Section */}
          {user && (
            <div className="border-b pb-4">
              <UserProfile />
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
