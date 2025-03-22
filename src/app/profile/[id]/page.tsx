"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Edit, LinkIcon, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/postCard";
import { Navbar } from "@/components/navbar";
import { EditProfileDialog } from "@/components/editProfileDialog";
import { useActions, useToken, useUser } from "@/store";
import useSWR, { SWRResponse, useSWRConfig } from "swr";
import { fetcher } from "@/utils/fetcher";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { DetailPostInfo, DetailUserInfo } from "@/types/response";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface postsFromResponse {
  message: string;
  posts: DetailPostInfo[];
}

interface followResponse {
  message: string;
  isFollowing: boolean;
}

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const user = useUser();
  const { toast } = useToast();
  const updateUserInfo = useActions().updateUserInfo;
  const { mutate } = useSWRConfig();
  const token = useToken();
  const User = useSWR([`/api/v1/users/${params.id}`, token], ([url, token]) =>
    fetcher({ path: url, method: "GET", token: token.idToken }),
  );
  const follow: SWRResponse<followResponse> = useSWR(
    [`/api/v1/users/${params.id}/isFollowing`, token],
    ([url, token]) =>
      fetcher({ path: url, method: "GET", token: token.idToken }),
  );

  const postRequests: SWRResponse<postsFromResponse> = useSWR(
    [`/api/v1/posts/by-user/${params.id}/all`, token],
    ([url, token]) =>
      fetcher({
        method: "GET",
        path: url,
        token: token.idToken,
      }),
  );

  const handleFollow = async () => {
    try {
      setIsFollowing(!isFollowing);
      await fetcher({
        method: "POST",
        path: isFollowing
          ? `/api/v1/users/${params.id}/unfollow`
          : `/api/v1/users/${params.id}/follow`,
        token: token.idToken,
      });
    } finally {
      mutate(`/api/v1/users/${params.id}`);
    }
  };

  useEffect(() => {
    if (User.data && "id" in User.data) {
      (("id" in user && User.data.id === user.id) || !("id" in user)) &&
        updateUserInfo(User.data);
    }
  }, [User.data]);

  useEffect(() => {
    if (User.error) {
      toast({
        variant: "destructive",
        title: "error",
        description: User.error.info.message,
      });
      User.error.status === 401 && router.push("/login");
    }
  }, [User.error]);

  useEffect(() => {
    if (user && "id" in user && user.id !== params.id) {
      setIsFollowing(follow.data?.isFollowing ?? false);
    }
  }, [follow.data, user, params.id]);

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
          <div className="relative">
            <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted sm:h-64">
              <Image
                src={"/images/sample.jpeg"}
                alt="Profile banner"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative mx-4 -mt-12 flex flex-col items-start sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="z-10 flex items-end">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background sm:h-32 sm:w-32">
                  {"profilePictureUrl" in user && !!user.profilePictureUrl ? (
                    <Image
                      src={user.profilePictureUrl || "/placeholder.svg"}
                      alt={
                        "username" in user && !!user.username
                          ? user.username
                          : "User"
                      }
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="relative bg-primary text-primary-foreground ">
                        {"displayName" in user && !!user.displayName
                          ? user.displayName.charAt(0)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="ml-4 pb-2">
                  <h1 className="text-2xl font-bold">
                    {"displayName" in user && !!user.displayName
                      ? user.displayName
                      : "User"}
                  </h1>
                  <p className="text-muted-foreground">
                    @
                    {"username" in user && !!user.username
                      ? user.username
                      : "user"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex w-full justify-end sm:mt-0 sm:w-auto">
                {user && "id" in user && user.id !== params.id && (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollow}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
                {user && "id" in user && user.id === params.id && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="mt-4 space-y-4">
              <p>{"bio" in user && !!user.bio ? user.bio : ""}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {"location" in user && !!user.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {user.location}
                  </div>
                )}
                {"website" in user && !!user.website && (
                  <div className="flex items-center">
                    <LinkIcon className="mr-1 h-4 w-4" />
                    <a
                      href={`${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Joined{" "}
                  {"createdAt" in user && !!user.createdAt
                    ? dayjs(user.createdAt).format("MMMM D, YYYY")
                    : "January 1, 1970"}
                </div>
                {/* <div>
                  <span className="font-bold">{userProfile.following}</span>{" "}
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div>
                  <span className="font-bold">{userProfile.followers}</span>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </div> */}
              </div>
            </div>

            <Tabs defaultValue="posts" className="mt-6">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="posts"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Posts
                </TabsTrigger>
                {/* <TabsTrigger
                  value="media"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger
                  value="likes"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Likes
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="posts" className="mt-4 space-y-4">
                {postRequests.isLoading && <p>Loading...</p>}
                {!!postRequests.data &&
                  !!postRequests.data.posts &&
                  postRequests.data.posts.length === 0 && (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                      <p className="text-center text-muted-foreground">
                        No posts yet
                      </p>
                    </div>
                  )}
                {!!postRequests.data &&
                  !!postRequests.data.posts &&
                  postRequests.data.posts.length > 0 &&
                  postRequests.data.posts.map((post: DetailPostInfo) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      // onDelete={handleDelete}
                      mutate={postRequests.mutate}
                    />
                  ))}
              </TabsContent>

              {/* <TabsContent value="media" className="mt-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {posts
                    .filter((post) => post.image)
                    .map((post) => (
                      <div
                        key={post.id}
                        className="relative aspect-square overflow-hidden rounded-lg"
                      >
                        <Image
                          src={post.image! || "/placeholder.svg"}
                          alt="Post image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                </div>
              </TabsContent> */}

              {/* <TabsContent value="likes" className="mt-4">
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-center text-muted-foreground">
                    No liked posts yet
                  </p>
                </div>
              </TabsContent> */}
            </Tabs>
          </div>

          <EditProfileDialog
            open={isEditProfileOpen}
            onOpenChange={setIsEditProfileOpen}
            profile={user as DetailUserInfo}
            // onSave={handleProfileUpdate}
          />
        </motion.div>
      </main>
    </>
  );
}
