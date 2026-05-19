export interface Url {
  id: number;
  code: string;
  longUrl: string;
  clicks: number;
  createdAt: string;
  expiresAt: string | null;
}

export interface CreateUrlRequest {
  longUrl: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface CreateUrlResponse {
  shortUrl: string;
  code: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
