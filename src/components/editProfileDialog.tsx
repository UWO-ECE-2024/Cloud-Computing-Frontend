"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DetailUserInfo } from "@/types/response";
import { useActions, useToken, useUser } from "@/store";
import { Avatar, AvatarFallback } from "./ui/avatar";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/utils/fetcher";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  // username: z
  //   .string()
  //   .min(2, {
  //     message: "Name must be at least 2 characters.",
  //   })
  //   .max(30, {
  //     message: "Name must not be longer than 30 characters.",
  //   }),
  displayName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(20, {
      message: "Username must not be longer than 20 characters.",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
  bio: z
    .string()
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    })
    .optional(),
  location: z
    .string()
    .max(30, {
      message: "Location must not be longer than 30 characters.",
    })
    .optional(),
  website: z
    .string()
    .max(100, {
      message: "Website must not be longer than 100 characters.",
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: DetailUserInfo;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}: EditProfileDialogProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const token = useToken();
  const { toast } = useToast();
  const updateUser = useActions().updateUserInfo;
  const user = useUser();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user,
  });

  const { mutate } = useSWRConfig();
  const CURRENT_USER_KEY = "/api/v1/users/me";
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      const updatedProfile = await fetcher({
        path: CURRENT_USER_KEY,
        method: "PUT",
        token: token.idToken,
        data: { ...values },
      });
      updateUser(updatedProfile);

      toast({
        title: "Success",
        description: "Your info update has been applied",
      });
      mutate(CURRENT_USER_KEY);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (e as any).info?.message || "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] w-full p-0 h-[90vh]  overflow-auto ">
        <DialogHeader className="sticky top-0 z-10 bg-background p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle>Edit profile</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-sm">
            Make changes to your profile information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-4 pt-0">
          {/* Banner Image */}
          <div className="space-y-4">
            <div className="relative">
              <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={"/images/sample.jpeg?height=300&width=1200"}
                  alt="Banner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                {/* <div className="absolute bottom-2 right-2 flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={bannerInputRef}
                    onChange={handleBannerChange}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 rounded-full"
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  {bannerPreview && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 rounded-full"
                      onClick={removeBanner}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div> */}
              </div>
            </div>

            {/* Avatar Image */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-background sm:h-20 sm:w-20">
                  {!!profile.profilePictureUrl &&
                  profile.profilePictureUrl.length > 0 ? (
                    <Image
                      src={profile.profilePictureUrl}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="relative bg-primary text-primary-foreground ">
                        {"displayName" in profile && !!profile.displayName
                          ? profile.displayName.charAt(0)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={avatarInputRef}
                    onChange={handleAvatarChange}
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-6 w-6 rounded-full sm:h-8 sm:w-8"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                {avatarPreview && (
                  <div className="absolute -right-1 bottom-0 sm:-right-2 sm:bottom-0">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6 rounded-full sm:h-8 sm:w-8"
                      onClick={removeAvatar}
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium">Profile Picture</h3>
                <p className="text-xs text-muted-foreground">
                  Upload a new profile picture
                </p>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Your unique username for your profile URL.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tell us about yourself"
                          className="resize-none"
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {field.value?.length || 0}/160 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="San Francisco, CA" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-background p-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
