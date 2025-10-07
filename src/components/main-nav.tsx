"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Map, Palette, LogIn, LayoutDashboard, Shield } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function MainNav() {
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
    <nav className="flex items-center gap-6">
      {allNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-gray-300",
              isActive
                ? "text-white"
                : "text-gray-400"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline-block">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
