"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface AuthFormProps {
  type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-primary">
          {type === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {type === "login"
            ? "Enter your credentials to access your account"
            : "Fill in your details to create a new account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "signup" && (
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              required
              disabled={isLoading}
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {type === "login" && (
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <Input id="password" type="password" required disabled={isLoading} />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {type === "login" ? "Logging in..." : "Creating account..."}
            </>
          ) : type === "login" ? (
            "Log in"
          ) : (
            "Sign up"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" disabled={isLoading}>
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" type="button" disabled={isLoading}>
          Google
        </Button>
      </div>

      <div className="text-center text-sm">
        {type === "login" ? (
          <>
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
}
