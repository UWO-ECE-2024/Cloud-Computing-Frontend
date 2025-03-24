export interface MediaState {
    user: any;
    token: {
        idToken: string;
        refreshToken: string;
    };
    authStatus: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'registration_required';
    authError: string | null;
}

export interface MediaStore extends MediaState {
    actions: {
        updateTokens: (newToken: MediaState['token']) => void;
        updateUserInfo: (newInfo: MediaState['user']) => void;
        login: (email: string, password: string) => Promise<void>;
        loginWithGoogle: () => Promise<void>;
        register: (email: string, password: string) => Promise<void>;
        completeRegistration: (username: string, displayName: string, bio?: string) => Promise<void>;
        logout: () => Promise<void>;
        refreshUserProfile: () => Promise<void>;
    };
} 