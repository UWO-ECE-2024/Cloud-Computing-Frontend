"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/postCard";
import { CommentSection } from "@/components/commentSection";
import { Navbar } from "@/components/navbar";
import useSWR, { SWRResponse } from "swr";
import { useToken } from "@/store";
import { fetcher } from "@/utils/fetcher";
import { DetailPostInfo, Comment } from "@/types/response";
import { useToast } from "@/hooks/use-toast";

interface PostResponse {
  message: string;
  post: DetailPostInfo;
}

interface CommentsResponse {
  message: string;
  comments: Comment[];
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = useToken();
  const postById: SWRResponse<PostResponse> = useSWR(
    [`/api/v1/posts/${params.id}`, token],
    ([url, token]) =>
      fetcher({
        method: "GET",
        path: url,
        token: token.idToken,
      }),
  );

  const commentFromPost: SWRResponse<CommentsResponse> = useSWR(
    [`/api/v1/comments/${params.id}/comments`, token],
    ([url, token]) =>
      fetcher({
        method: "GET",
        path: url,
        token: token.idToken,
      }),
  );

  const handleAddComment = async (postId: string, content: string) => {
    try {
      await fetcher({
        method: "POST",
        path: `/api/v1/comments/${postId}/comments`,
        token: token.idToken,
        data: { content },
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Something goes wrong",
        description: (e as any).info?.message || "An unknown error occurred",
      });
    } finally {
      commentFromPost.mutate();
    }
  };

  const handleLikeComment = async (commentId: string, like: boolean) => {
    try {
      await fetcher({
        method: "POST",
        path: like
          ? `/api/v1/comment-likes/${commentId}/unlike`
          : `/api/v1/comment-likes/${commentId}/like`,
        token: token.idToken,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Something goes wrong",
        description: (e as any).info?.message || "An unknown error occurred",
      });
    }
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-xl font-bold">Post</h1>
          </div>

          {postById.isLoading && <p>Loading...</p>}
          {!!postById.data?.post && <PostCard post={postById.data?.post} />}

          <CommentSection
            postId={params.id as string}
            comments={commentFromPost.data?.comments ?? []}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
          {commentFromPost.isLoading && <p>Loading...</p>}
        </motion.div>
      </main>
    </>
  );
}
