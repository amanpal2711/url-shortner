export interface ShortUrl {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  customAlias: boolean;
  clicks: number;
  createdAt: string;
  expiresAt: string | null;
}

export interface CreateUrlRequest {
  originalUrl: string;
  customAlias?: string;
  expiryDate?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
