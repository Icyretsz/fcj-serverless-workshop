import { apiClient } from './apiClient';
import {
  AuthTokens,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  GetUserInfoResponse,
  User,
} from '../types';

const TOKEN_STORAGE_KEY = 'authTokens';

const storeTokens = (tokens: AuthTokens): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
};

const getStoredTokens = (): AuthTokens | null => {
  const tokensStr = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!tokensStr) return null;

  try {
    return JSON.parse(tokensStr) as AuthTokens;
  } catch {
    return null;
  }
};

const register = async (username: string, email: string, password: string): Promise<void> => {
  const request: RegisterRequest = { username, email, password };
  const response = await apiClient.post<RegisterResponse>('/register', request);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Registration failed');
  }
};

const login = async (username: string, password: string): Promise<AuthTokens> => {
  const request: LoginRequest = { username, password };
  const response = await apiClient.post<LoginResponse>('/login', request);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Login failed');
  }

  const tokens: AuthTokens = {
    accessToken: response.data.accessToken,
    idToken: response.data.idToken,
    refreshToken: response.data.refreshToken,
    expiresIn: response.data.expiresIn,
  };

  storeTokens(tokens);
  return tokens;
};

const getUserInfo = async (): Promise<User> => {
  const response = await apiClient.get<GetUserInfoResponse>('/user');

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch user info');
  }

  return response.data.user;
};

const logout = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

const isAuthenticated = (): boolean => {
  return getStoredTokens() !== null;
};

export const authService = {
  register,
  login,
  getUserInfo,
  storeTokens,
  getStoredTokens,
  logout,
  isAuthenticated,
};
