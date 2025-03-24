"use client";

import { useAuthStatus } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const authStatus = useAuthStatus();
    const router = useRouter();

    useEffect(() => {
        if (authStatus === 'unauthenticated' || authStatus === 'idle') {
            router.push('/login');
        } else if (authStatus === 'registration_required') {
            router.push('/complete-profile');
        }
    }, [authStatus, router]);

    if (authStatus !== 'authenticated') {
        return null; // Don't render anything while checking auth or redirecting
    }

    return <>{children}</>;
} 