export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

