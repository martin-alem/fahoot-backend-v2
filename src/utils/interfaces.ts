export interface ErrorResponse {
  message?: string;
  [key: string]: any; // This allows for other properties
}

export interface PingResponse {
  message: string;
  timestamp: string;
}
