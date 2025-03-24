"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStatus } from "@/store";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register"];

// Define routes that should only be accessible in specific auth states
const AUTH_STATE_ROUTES = {
  authenticated: ["/"],
  registration_required: ["/complete-profile"],
  unauthenticated: ["/login", "/register"],
};

export default function AuthStateRedirects() {
  const router = useRouter();
  const pathname = usePathname();
  const authStatus = useAuthStatus();

  useEffect(() => {
    // Skip redirection for public routes
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    // Protect authenticated-only routes
    if (
      (authStatus === "unauthenticated" || authStatus === "idle") &&
      !isPublicRoute
    ) {
      router.push("/login");
      return;
    }

    // Redirect authenticated users away from auth pages
    if (authStatus === "authenticated" && isPublicRoute) {
      router.push("/");
      return;
    }

    // Handle registration required state
    if (
      authStatus === "registration_required" &&
      !pathname.startsWith("/complete-profile")
    ) {
      router.push("/complete-profile");
      return;
    }
  }, [authStatus, pathname, router]);

  // This component doesn't render anything
  return null;
}
