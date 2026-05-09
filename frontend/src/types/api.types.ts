export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}