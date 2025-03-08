"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Heart, MessageCircle, MoreHorizontal, Share } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  image?: string;
  createdAt: Date;
  likes: number;
  comments: number;
  liked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PostCard({ post, onLike, onComment, onDelete }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.(post.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Link href={`/profile/${post.user.id}`} className="flex-shrink-0">
            <Avatar>
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {post.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/profile/${post.user.id}`}
                  className="font-semibold hover:underline"
                >
                  {post.user.name}
                </Link>
                <div className="text-sm text-muted-foreground">
                  @{post.user.username} ·{" "}
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Copy link</DropdownMenuItem>
                  <DropdownMenuItem>Report</DropdownMenuItem>
                  {post.user.id === "current-user" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete?.(post.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4 py-2">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
          {post.image && (
            <div className="relative aspect-video w-full overflow-hidden sm:aspect-[2/1]">
              <Image
                src={post.image || "/images/sample.jpeg"}
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between p-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex gap-1",
              liked ? "text-red-500" : "text-muted-foreground",
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex gap-1 text-muted-foreground"
            onClick={() => onComment?.(post.id)}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Share className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
