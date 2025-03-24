"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useActions } from "@/store";
import { useToast } from "@/hooks/use-toast";

export function ProfileForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const actions = useActions();

    const [formData, setFormData] = useState({
        username: "",
        displayName: "",
        bio: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.username || !formData.displayName) {
            toast({
                variant: "destructive",
                title: "Required Fields Missing",
                description: "Username and display name are required.",
            });
            return;
        }

        setIsLoading(true);

        try {
            await actions.completeRegistration(
                formData.username,
                formData.displayName,
                formData.bio || undefined
            );

            toast({
                title: "Profile Completed",
                description: "Your profile has been set up successfully!",
            });

            router.push("/");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Registration Error",
                description: (error as any).message || "Failed to complete registration",
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
                <h1 className="text-3xl font-bold text-primary">Complete Your Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Just a few more details to set up your account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        placeholder="johndoe"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                        This will be your unique identifier on the platform
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                        id="displayName"
                        name="displayName"
                        placeholder="John Doe"
                        required
                        value={formData.displayName}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="min-h-[100px] resize-none"
                    />
                </div>

                <Button
                    className="w-full"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                        "Complete Registration"
                    )}
                </Button>
            </form>
        </motion.div>
    );
} 