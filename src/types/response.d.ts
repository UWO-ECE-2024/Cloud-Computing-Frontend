export type User = {
  id: string;
  username: string;
  displayName: string;
  profilePictureUrl: string;
  bio: string;
};

export type DetailUserInfo = User & {
  email: string;
  location: string;
  website: string;
  createdAt: Date;
};

export type Post = {
  id: string;
  userId: string;
  content: string;
  mediaUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DetailPostInfo = Post & {
  user: User;
  _count: {
    comments: number;
    likes: number;
  };
};

export type Comment = {
  id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    username: string;
    displayName: string;
    profilePictureUrl: string;
  };
  _count: {
    likes: number;
  };
};
