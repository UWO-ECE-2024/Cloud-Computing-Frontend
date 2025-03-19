"use client";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

import { CreatePost } from "@/components/createPostBar";
import { PostCard } from "@/components/postCard";

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = (content: string, image?: File) => {
    setIsSubmitting(true);
    setIsSubmitting(false);
  };

  const handleComment = (id: string) => {
    router.push(`/post/${id}`);
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
            {/* {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onComment={handleComment}
              />
            ))} */}
          </motion.div>
        </div>
      </main>
    </>
  );
}
