import { AuthForm } from "@/components/authForm";

export default function RegisterPage() {
    return (
        <main className="container mx-auto max-w-screen-lg pt-16 pb-20 md:pt-24 md:pb-10">
            <div className="container flex min-h-[80vh] flex-col items-center justify-center">
                <AuthForm type="register" />
            </div>
        </main>
    );
} 