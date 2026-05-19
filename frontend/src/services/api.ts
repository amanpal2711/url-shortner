import type { ShortUrl, CreateUrlRequest } from '../types';

const API_BASE = 'http://localhost:3001/api';

export async function createShortUrl(data: CreateUrlRequest): Promise<ShortUrl> {
  const response = await fetch(`${API_BASE}/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create short URL');
  }

  return response.json();
}

export async function getUrls(search?: string): Promise<ShortUrl[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await fetch(`${API_BASE}/urls${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch URLs');
  }

  return response.json();
}

export async function deleteUrl(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/urls/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete URL');
  }
}
