"use client";

import { ProfileForm } from "@/components/auth/ProfileForm";
import { useAuthStatus } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CompleteProfilePage() {
    const authStatus = useAuthStatus();
    const router = useRouter();

    // Redirect if user is not in registration_required state
    useEffect(() => {
        if (authStatus === 'unauthenticated' || authStatus === 'idle') {
            router.push('/login');
        } else if (authStatus === 'authenticated') {
            router.push('/');
        }
    }, [authStatus, router]);

    if (authStatus !== 'registration_required') {
        return null; // Don't render anything while redirecting
    }

    return (
        <main className="container mx-auto max-w-screen-lg pt-16 pb-20 md:pt-24 md:pb-10">
            <div className="container flex min-h-[80vh] flex-col items-center justify-center">
                <ProfileForm />
            </div>
        </main>
    );
} 