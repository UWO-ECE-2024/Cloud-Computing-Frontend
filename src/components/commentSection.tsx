"use client";

import type React from "react";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Heart, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  liked?: boolean;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
}

export function CommentSection({
  postId,
  comments,
  onAddComment,
  onLikeComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setIsSubmitting(true);

      // Simulate comment submission
      setTimeout(() => {
        onAddComment(postId, newComment);
        setNewComment("");
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div className="space-y-4">
      <Separator />

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-user.jpg" alt="Your avatar" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            U
          </AvatarFallback>
        </Avatar>
        <div className="relative flex-1">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            className="pr-10"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full"
            disabled={!newComment.trim() || isSubmitting}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-2"
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {comment.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {comment.user.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      @{comment.user.username}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(comment.createdAt, {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <p className="mt-1 text-sm">{comment.content}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 gap-1 px-2 text-xs",
                  comment.liked ? "text-red-500" : "text-muted-foreground",
                )}
                onClick={() => onLikeComment(comment.id)}
              >
                <Heart
                  className={cn("h-3 w-3", comment.liked && "fill-current")}
                />
                <span>{comment.likes}</span>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
