import type { Url, CreateUrlRequest, CreateUrlResponse } from '../types';

const API_BASE = '/api';

export async function createShortUrl(data: CreateUrlRequest): Promise<CreateUrlResponse> {
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

export async function getUrls(): Promise<Url[]> {
  const response = await fetch(`${API_BASE}/urls`);

  if (!response.ok) {
    throw new Error('Failed to fetch URLs');
  }

  return response.json();
}

export async function deleteUrl(code: string): Promise<void> {
  const response = await fetch(`${API_BASE}/urls/${code}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete URL');
  }
}
