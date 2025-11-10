import { User, UserSession } from '../entities/user.entity';

export interface LoginCredentials {
  email: string;
  password: string;
  tenant?: string; // Optional tenant name for validation
}

export interface UserAuthentication {
  is_super_admin: boolean;
  tenant_id: string | null;
  tenant_name: string | null;
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<UserSession>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshSession(refreshToken: string): Promise<UserSession>;
  isUserAdmin(): Promise<boolean>;
  getUserAuthentication(): Promise<UserAuthentication | null>;
}

