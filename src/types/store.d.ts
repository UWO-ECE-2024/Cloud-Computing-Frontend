import { DetailUserInfo, User } from "./response";

export type MediaState = {
  user: DetailUserInfo | User | {};
  token: {
    idToken: string;
    refreshToken: string;
  };
};

export type MediaAction = {
  actions: {
    updateTokens: (tokens: MediaState["token"]) => void;
    updateUserInfo: (info: MediaState["user"]) => void;
  };
};

export type MediaStore = MediaState & MediaAction;
