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

export interface UrlRow {
  id: number;
  code: string;
  long_url: string;
  clicks: number;
  created_at: string;
  expires_at: string | null;
}
