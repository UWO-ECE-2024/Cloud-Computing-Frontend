"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Search, User } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/themeToggle";
import { useUser } from "@/store";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  // {
  //   name: "Search",
  //   href: "/search",
  //   icon: Search,
  // },
  // {
  //   name: "Notifications",
  //   href: "/notifications",
  //   icon: Bell,
  // },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const user = useUser();
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background p-2 backdrop-blur-lg md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="mx-auto flex max-w-screen-lg items-center justify-between px-4">
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/" className="text-xl font-bold text-primary">
            Group 6
          </Link>
        </div>

        <div className="flex w-full items-center justify-around md:w-auto md:justify-start md:gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname ===
              (item.name === "Profile" && "id" in user
                ? `/profile/${user.id}`
                : item.href);

            return (
              <Link
                key={
                  item.name === "Profile" && "id" in user
                    ? `/profile/${user.id}`
                    : item.href
                }
                href={
                  item.name === "Profile" && "id" in user
                    ? `/profile/${user.id}`
                    : item.href
                }
                className={cn(
                  "relative flex flex-col items-center justify-center p-2 md:flex-row md:gap-2 md:px-3 md:py-2",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs md:text-sm">{item.name}</span>

                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 w-full bg-primary md:bottom-auto md:top-0"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
