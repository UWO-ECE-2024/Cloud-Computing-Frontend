"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToken, useUser } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/utils/fetcher";

// Add this interface before the component
interface ProfileUser {
    id?: string;
    username?: string;
    displayName?: string;
    bio?: string;
    location?: string;
    website?: string;
    profilePictureUrl?: string;
}

export function ProfileEditor() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const token = useToken();
    const user = useUser();

    const [formData, setFormData] = useState({
        username: "",
        displayName: "",
        bio: "",
        location: "",
        website: ""
    });

    // Initialize form with user data
    useEffect(() => {
        const profileUser = user as ProfileUser;
        if (profileUser && typeof profileUser === 'object') {
            setFormData({
                username: profileUser.username || "",
                displayName: profileUser.displayName || "",
                bio: profileUser.bio || "",
                location: profileUser.location || "",
                website: profileUser.website || ""
            });
        }
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle profile image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Image upload functionality would go here
            toast({
                title: "Feature Coming Soon",
                description: "Profile image upload will be available soon",
            });
        }
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
            const updatedUser = await fetcher({
                method: "PUT",
                path: "/api/v1/users/me",
                token: token.idToken,
                data: formData
            });

            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully!",
            });

            // Redirect to profile view
            const profileUser = user as ProfileUser;
            if (profileUser.id) {
                router.push(`/profile/${profileUser.id}`);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: (error as any).info?.message || "Failed to update profile",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Get user's initials for avatar fallback
    const getInitials = () => {
        const profileUser = user as ProfileUser;
        if (profileUser.displayName) {
            return profileUser.displayName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase();
        }
        return profileUser.username ? profileUser.username[0].toUpperCase() : "U";
    };

    return (
        <div className="space-y-8 rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={(user as ProfileUser).profilePictureUrl || ""} />
                        <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <label
                        htmlFor="profile-image"
                        className="absolute -right-2 -top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">
                        {(user as ProfileUser).displayName || (user as ProfileUser).username || ""}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        @{(user as ProfileUser).username || ""}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
} 