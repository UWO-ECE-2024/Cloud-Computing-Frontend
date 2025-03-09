"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Edit, LinkIcon, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard, type Post } from "@/components/postCard";
import { Navbar } from "@/components/navbar";
import { EditProfileDialog } from "@/components/editProfileDialog";

// Sample data
const initialUserProfile = {
  id: "current-user",
  name: "Jim Luo",
  username: "jimluo_",
  bio: "UI/UX Designer & Frontend Developer | Creating digital experiences that people love",
  location: "London, ON",
  website: "jimmieluo.com",
  joinedDate: "January 2020",
  following: 245,
  followers: 1024,
  avatar: "/placeholder.svg?height=120&width=120",
  banner: "/placeholder.svg?height=300&width=1200",
};

const userPosts: Post[] = [
  {
    id: "1",
    user: {
      id: "current-user",
      name: initialUserProfile.name,
      username: initialUserProfile.username,
      avatar: initialUserProfile.avatar,
    },
    content:
      "Just launched my new portfolio website! Check it out and let me know what you think 🚀",
    image: "/placeholder.svg?height=400&width=600",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 24,
    comments: 5,
  },
  {
    id: "2",
    user: {
      id: "current-user",
      name: initialUserProfile.name,
      username: initialUserProfile.username,
      avatar: initialUserProfile.avatar,
    },
    content:
      "Working on a new design system for our product. Here's a sneak peek of the color palette we're considering.",
    image: "/placeholder.svg?height=400&width=600",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    likes: 42,
    comments: 7,
  },
  {
    id: "3",
    user: {
      id: "current-user",
      name: initialUserProfile.name,
      username: initialUserProfile.username,
      avatar: initialUserProfile.avatar,
    },
    content:
      "Just finished reading 'Atomic Habits' by James Clear. Highly recommend it if you're looking to build better habits and break bad ones!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    likes: 18,
    comments: 3,
  },
];

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [posts, setPosts] = useState<Post[]>(userPosts);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleLike = (id: string) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    // Update the user profile
    const newProfile = {
      ...userProfile,
      ...updatedProfile,
      // If we have new files, create object URLs for them
      avatar: updatedProfile.avatar
        ? URL.createObjectURL(updatedProfile.avatar)
        : userProfile.avatar,
      banner: updatedProfile.banner
        ? URL.createObjectURL(updatedProfile.banner)
        : userProfile.banner,
    };

    setUserProfile(newProfile);

    // Update the user info in all posts
    setPosts(
      posts.map((post) => ({
        ...post,
        user: {
          ...post.user,
          name: newProfile.name,
          username: newProfile.username,
          avatar: newProfile.avatar,
        },
      })),
    );
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-screen-lg pt-16 pb-20 md:pt-24 md:pb-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="relative">
            <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted sm:h-64">
              <Image
                src={userProfile.banner || "/placeholder.svg"}
                alt="Profile banner"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative mx-4 -mt-12 flex flex-col items-start sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="z-10 flex items-end">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background sm:h-32 sm:w-32">
                  <Image
                    src={userProfile.avatar || "/placeholder.svg"}
                    alt={userProfile.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 pb-2">
                  <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                  <p className="text-muted-foreground">
                    @{userProfile.username}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex w-full justify-end sm:mt-0 sm:w-auto">
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="mt-4 space-y-4">
              <p>{userProfile.bio}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {userProfile.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {userProfile.location}
                  </div>
                )}
                {userProfile.website && (
                  <div className="flex items-center">
                    <LinkIcon className="mr-1 h-4 w-4" />
                    <a
                      href={`https://${userProfile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {userProfile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Joined {userProfile.joinedDate}
                </div>
              </div>

              <div className="flex gap-4">
                <div>
                  <span className="font-bold">{userProfile.following}</span>{" "}
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div>
                  <span className="font-bold">{userProfile.followers}</span>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="posts" className="mt-6">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="posts"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger
                  value="likes"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Likes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-4 space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onDelete={handleDelete}
                  />
                ))}
              </TabsContent>

              <TabsContent value="media" className="mt-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {posts
                    .filter((post) => post.image)
                    .map((post) => (
                      <div
                        key={post.id}
                        className="relative aspect-square overflow-hidden rounded-lg"
                      >
                        <Image
                          src={post.image! || "/placeholder.svg"}
                          alt="Post image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="likes" className="mt-4">
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-center text-muted-foreground">
                    No liked posts yet
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <EditProfileDialog
            open={isEditProfileOpen}
            onOpenChange={setIsEditProfileOpen}
            profile={userProfile}
            onSave={handleProfileUpdate}
          />
        </motion.div>
      </main>
    </>
  );
}
