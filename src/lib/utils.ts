import { PageResponse } from "@/app/page";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getKey = (pageIndex: number, previousPageData: PageResponse) => {
  if (previousPageData && !previousPageData.posts) return null;

  if (pageIndex === 0) return `/api/v1/posts/feed?limit=10`;

  return `/api/v1/posts/feed?cursor=${previousPageData.nextCursor}&limit=10`;
};
