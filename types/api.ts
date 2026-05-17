// types/api.ts

export type ApiResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Common pagination type
export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  nextCursor?: string;
}>;
