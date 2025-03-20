import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useToken } from "@/store";
import useSWR, { SWRResponse } from "swr";
import { fetcher } from "@/utils/fetcher";

interface CommentActionProps {
  commentId: string;
  onLikeComment: (commentId: string) => void;
}

interface isLikeResponse {
  message: string;
  hasLiked: boolean;
}

export function CommentAction({
  commentId,
  onLikeComment,
}: CommentActionProps) {
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

  return (
    !!isLikeComment.data && (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-6 gap-1 px-2 text-xs",
          isLikeComment.data.hasLiked
            ? "text-red-500"
            : "text-muted-foreground",
        )}
        onClick={() => onLikeComment(commentId)}
      >
        <Heart
          className={cn(
            "h-3 w-3",
            isLikeComment.data.hasLiked && "fill-current",
          )}
        />
        <span>{isLikeComment.data.hasLiked}</span>
      </Button>
    )
  );
}
