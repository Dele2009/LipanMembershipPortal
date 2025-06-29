import { createContext } from "react";

export interface UserType {
  profile_pic: string;
  full_name: string;
  email: string;
  phone: string;
  is_admin: boolean;
  is_superuser: boolean;
  payment_status: "unpaid" | "paid" | "pending";
  membership_detail: Record<string, any> | null;
}

export type Tokens = {
  access: string;
  refresh: string;
};

export type LoginData = {
  user: UserType;
} & Tokens
export interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
