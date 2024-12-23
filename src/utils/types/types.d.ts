export interface ApiResponse<T> {
  meta: {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
  };
  data: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PaginatedApiResponse<T> {
  meta: {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
    pagination: PaginationMeta;
  };
  data: T[];
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
