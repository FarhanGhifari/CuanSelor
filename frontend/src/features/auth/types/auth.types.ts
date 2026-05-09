export interface User {
    id: string,
    name: string,
    email: string,
    emailVerified: boolean,
    createdAt: string,
}

export interface LoginPayload {
    email: string,
    password: string,
    remmemberMe?: boolean,
}

export interface RegisterPayload {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
}

export interface AuthResponse {
  user: User;
  access_token: string;
}