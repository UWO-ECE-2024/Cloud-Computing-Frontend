"use client";

import { useEffect, useState } from "react";
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
import { DetailPostInfo } from "@/types/response";
import useSWR, { SWRResponse, useSWRConfig } from "swr";
import { useToken, useUser } from "@/store";
import { fetcher } from "@/utils/fetcher";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: DetailPostInfo;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onDelete?: (id: string) => void;
}

interface LikeResponse {
  message: string;
  hasLiked: boolean;
}

export function PostCard({ post, onLike, onComment, onDelete }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const token = useToken();
  const user = useUser();
  const isLike: SWRResponse<LikeResponse> = useSWR(
    [`/api/v1/post-likes/${post.id}/hasLiked`, token],
    ([url, token]) =>
      fetcher({ method: "GET", token: token.idToken, path: url }),
  );
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const { mutate } = useSWRConfig();
  const REFRESHKEY = `/api/v1/posts/by-user/${"id" in user ? user.id : ""}/all`;
  const handleLike = async () => {
    try {
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      await fetcher({
        method: "POST",
        path: liked
          ? `/api/v1/post-likes/${post.id}/like`
          : `/api/v1/post-likes/${post.id}/unlike`,
        token: token.idToken,
      });
    } finally {
      mutate(REFRESHKEY);
    }
  };

  const handleDelete = async () => {
    try {
      await fetcher({
        method: "DELETE",
        path: `/api/v1/posts/${post.id}`,
        token: token.idToken,
      });
    } finally {
      mutate(REFRESHKEY);
    }
  };

  useEffect(() => {
    if (isLike.data && isLike.data.hasLiked !== liked) {
      setLiked(isLike.data.hasLiked);
    }
  }, [isLike.data]);

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
              <AvatarImage
                src={post.user.profilePictureUrl}
                alt={post.user.username}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {post.user.displayName.charAt(0)}
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
                  {post.user.displayName}
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

                  {"id" in user && post.userId === user.id && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={handleDelete}
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
          {post.mediaUrl && (
            <div className="relative aspect-video w-full overflow-hidden sm:aspect-[2/1]">
              <Image
                src={post.mediaUrl || "/images/sample.jpeg"}
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
            <span>{post._count.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Share className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
