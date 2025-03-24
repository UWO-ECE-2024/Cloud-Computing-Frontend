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
import { useUser } from "@/store";
import { Comment } from "@/types/response";
import { CommentAction } from "./commentAction";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string, like: boolean) => void;
}

export function CommentSection({
  postId,
  comments,
  onAddComment,
  onLikeComment,
}: CommentSectionProps) {
  const user = useUser();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setIsSubmitting(true);
      onAddComment(postId, newComment);
      setNewComment("");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Separator />

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatar.svg" alt="Your avatar" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {"displayName" in user && !!user.displayName
              ? user.displayName.charAt(0)
              : "U"}
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
              <AvatarImage
                src={comment.user.profilePictureUrl}
                alt={comment.user.username}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {comment.user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {comment.user.username}{" "}
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
              <CommentAction
                commentId={comment.id}
                onLikeComment={onLikeComment}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
