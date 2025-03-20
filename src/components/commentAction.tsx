"use client"
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useToken } from "@/store";
import useSWR, { SWRResponse } from "swr";
import { fetcher } from "@/utils/fetcher";
import { useEffect, useState } from "react";

interface CommentActionProps {
  commentId: string;
  onLikeComment: (commentId: string,like:boolean) => void;
}

interface isLikeResponse {
  message: string;
  hasLiked: boolean;
}

export function CommentAction({
  commentId,
  onLikeComment,
}: CommentActionProps) {
	const [isLike,setIsLike] = useState(false);
  const token = useToken();
  const isLikeComment: SWRResponse<isLikeResponse> = useSWR(
    [`/api/v1/comment-likes/${commentId}/hasLiked`, token],
    ([url, token]) =>
      fetcher({
        method: "GET",
        path: url,
        token: token.idToken,
      }),
  );
  useEffect(()=>{
	isLikeComment.data && setIsLike(isLikeComment.data.hasLiked)
  },[isLikeComment.data])

  return (
    !!isLikeComment.data && (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-6 gap-1 px-2 text-xs",
          isLike
            ? "text-red-500"
            : "text-muted-foreground",
        )}
        onClick={() => {
		setIsLike(!isLike)
		onLikeComment(commentId,isLike)}}
      >
        <Heart
          className={cn(
            "h-3 w-3",
            isLike && "fill-current",
          )}
        />
        <span>{isLike}</span>
      </Button>
    )
  );
}
