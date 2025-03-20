"use client";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

import { CreatePost } from "@/components/createPostBar";
import { PostCard } from "@/components/postCard";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/utils/fetcher";
import { useToken } from "@/store";
import { useSWRConfig } from "swr";

export default function Home() {
  const router = useRouter();
  const token = useToken();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const handleCreatePost = async (content: string, image?: File) => {
    setIsSubmitting(true);
    try {
      await fetcher({
        method: "POST",
        token: token.idToken,
        path: "/api/v1/posts",
        data: {
          content,
        },
      });
      // todo refetch home page
      toast({
        title: "Success",
      });
    } catch (e) {
      toast({
        title: "Something Wrong",
        description: (e as any).info?.message || "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
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
