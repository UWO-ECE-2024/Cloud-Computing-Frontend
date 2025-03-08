"use client";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

import { CreatePost } from "@/components/createPostBar";
import { PostCard, type Post } from "@/components/postCard";

// Sample data
const initialPosts: Post[] = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Jim Luo",
      username: "jimluo_",
      // avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just launched my new portfolio website! Check it out and let me know what you think 🚀",
    image: "/images/sample.jpeg",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 24,
    comments: 5,
  },
  {
    id: "2",
    user: {
      id: "current-user",
      name: "You",
      username: "yourusername",
      // avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Working on a new design system for our product. Here's a sneak peek of the color palette we're considering.",
    image: "/images/sample.jpeg",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 42,
    comments: 7,
    liked: true,
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Sarah Miller",
      username: "sarahm",
      // avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just finished reading 'Atomic Habits' by James Clear. Highly recommend it if you're looking to build better habits and break bad ones!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    likes: 18,
    comments: 3,
  },
];

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = (content: string, image?: File) => {
    setIsSubmitting(true);

    // Simulate post creation
    setTimeout(() => {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        user: {
          id: "current-user",
          name: "You",
          username: "yourusername",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content,
        image: image ? URL.createObjectURL(image) : undefined,
        createdAt: new Date(),
        likes: 0,
        comments: 0,
        liked: false,
      };

      setPosts([newPost, ...posts]);
      setIsSubmitting(false);
    }, 1500);
  };

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

  const handleComment = (id: string) => {
    router.push(`/post/${id}`);
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-screen-lg pt-16 pb-20 md:pt-24 md:pb-10">
        <div className="space-y-6">
          <CreatePost onSubmit={handleCreatePost} isSubmitting={isSubmitting} />

          <motion.div
            className="space-y-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>
        </div>
      </main>
    </>
  );
}
