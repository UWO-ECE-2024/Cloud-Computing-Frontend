"use client";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { CreatePost } from "@/components/createPostBar";
import { PostCard } from "@/components/postCard";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/utils/fetcher";
import { useToken } from "@/store";
import useSWR, { SWRResponse, useSWRConfig } from "swr";
import useSWRInfinite, {
  SWRInfiniteResponse,
  unstable_serialize,
} from "swr/infinite";
import { MediaState } from "@/types/store";
import { DetailPostInfo } from "@/types/response";
import { getKey } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export interface PageResponse {
  message: string;
  posts: DetailPostInfo[];
  nextCursor: string;
  count: number;
}

export default function Home() {
  const router = useRouter();
  const token: MediaState["token"] = useToken();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  const post_page: SWRInfiniteResponse<PageResponse> = useSWRInfinite(
    getKey,
    (return_value) =>
      fetcher({
        method: "GET",
        path: return_value,
        token: token.idToken,
      }),
  );
  const handleCreatePost = async (content: string, mediaUrl?: string) => {
    setIsSubmitting(true);
    try {
      await fetcher({
        method: "POST",
        token: token.idToken,
        path: "/api/v1/posts",
        data: {
          content,
          ...(mediaUrl && { mediaUrl }),
        },
      });
      // todo refetch home page
      toast({
        title: "Success",
      });
      mutate(unstable_serialize(getKey));
    } catch (e) {
      toast({
        title: "Something Wrong",
        description: (e as any).info?.message || "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMore = () => {
    if (!post_page.isValidating) {
      post_page.setSize(post_page.size + 1);
    }
  };

  const observerRef = useInfiniteScroll(loadMore);

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
            {!post_page?.data ? (
              <p>Loading...</p>
            ) : (
              post_page.data.map((page) =>
                page.posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onComment={handleComment}
                  />
                )),
              )
            )}
          </motion.div>
          <div ref={observerRef} className="h-1" />
          {post_page.isValidating && <div>Loading more...</div>}
        </div>
      </main>
    </>
  );
}
