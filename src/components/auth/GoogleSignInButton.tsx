"use client";

import { Button } from "@/components/ui/button";
import { useActions } from "@/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function GoogleSignInButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { loginWithGoogle } = useActions();
    const router = useRouter();
    const { toast } = useToast();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            // Will redirect based on whether registration is required or not
            router.push("/");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Authentication Error",
                description: (error as any).message || "Failed to sign in with Google",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            className="w-full"
            onClick={handleGoogleSignIn}
        >
            {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                <>
                    <svg
                        className="mr-2 h-4 w-4"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                            fill="currentColor"
                        />
                    </svg>
                    Sign in with Google
                </>
            )}
        </Button>
    );
} 