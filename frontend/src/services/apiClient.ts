import { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000';

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

const getAuthToken = (): string | null => {
  const tokensStr = localStorage.getItem('authTokens');
  if (!tokensStr) return null;

  try {
    const tokens = JSON.parse(tokensStr);
    return tokens.idToken || null;
  } catch {
    return null;
  }
};

const request = async <T>(
  endpoint: string,
  options: Partial<RequestOptions> = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

const get = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, { method: 'GET' });
};

const post = async <T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const apiClient = {
  get,
  post,
};
