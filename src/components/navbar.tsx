"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, LogOut, Search, User } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/themeToggle";
import { useActions, useAuthStatus, useUser } from "@/store";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
  const authStatus = useAuthStatus();
  const actions = useActions();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await actions.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return user.username ? user.username[0].toUpperCase() : "U";
  };

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

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />

          {authStatus === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.profilePictureUrl || ""}
                      alt={user.displayName || user.username || ""}
                    />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.displayName && (
                      <p className="font-medium">{user.displayName}</p>
                    )}
                    {user.username && (
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
