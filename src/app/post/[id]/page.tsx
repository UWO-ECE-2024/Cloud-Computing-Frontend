"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { PostCard, type Post } from "@/components/postCard";
import { CommentSection, type Comment } from "@/components/commentSection";
import { Navbar } from "@/components/navbar";

// Sample data
const samplePost: Post = {
  id: "1",
  user: {
    id: "user1",
    name: "Jim Luo",
    username: "jimluo_",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  content:
    "Just launched my new portfolio website! Check it out and let me know what you think 🚀",
  image: "/placeholder.svg?height=400&width=600",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  likes: 24,
  comments: 5,
};

const sampleComments: Comment[] = [
  {
    id: "c1",
    user: {
      id: "user2",
      name: "Emma Wilson",
      username: "emmaw",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "This looks amazing! Love the design choices.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    likes: 3,
  },
  {
    id: "c2",
    user: {
      id: "user3",
      name: "Sarah Miller",
      username: "sarahm",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Great work! What technologies did you use to build it?",
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    likes: 2,
  },
  {
    id: "c3",
    user: {
      id: "current-user",
      name: "You",
      username: "yourusername",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "I really like the minimalist approach. Clean and effective!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    likes: 5,
    liked: true,
  },
];

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post>(samplePost);
  const [comments, setComments] = useState<Comment[]>(sampleComments);

  const handleLike = () => {
    setPost({
      ...post,
      liked: !post.liked,
      likes: post.liked ? post.likes - 1 : post.likes + 1,
    });
  };

  const handleAddComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: {
        id: "current-user",
        name: "You",
        username: "yourusername",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content,
      createdAt: new Date(),
      likes: 0,
      liked: false,
    };

    setComments([newComment, ...comments]);
    setPost({
      ...post,
      comments: post.comments + 1,
    });
  };

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment,
      ),
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

          <PostCard post={post} onLike={handleLike} />

          <CommentSection
            postId={params.id}
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        </motion.div>
      </main>
    </>
  );
}
