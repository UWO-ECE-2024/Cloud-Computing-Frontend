"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useActions, useAuthStatus } from "@/store";
import { GoogleSignInButton } from "./auth/GoogleSignInButton";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface AuthFormProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const authStatus = useAuthStatus();
  const actions = useActions();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (type === "register" && formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please ensure your passwords match.",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (type === "login") {
        await actions.login(formData.email, formData.password);

        if (authStatus === "registration_required") {
          router.push("/complete-profile");
        } else {
          router.push("/");
        }
      } else {
        await actions.register(formData.email, formData.password);
        router.push("/complete-profile");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description:
          (error as any).message ||
          `Failed to ${type === "login" ? "login" : "register"}`,
      });
    } finally {
      setIsLoading(false);
    }
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
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        {type === "register" && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        )}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : type === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <span className="relative bg-card px-2 text-xs uppercase text-muted-foreground">
            Or continue with
          </span>
        </div>

        <GoogleSignInButton />

        <div className="text-center text-sm">
          {type === "login" ? (
            <p>
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
}
