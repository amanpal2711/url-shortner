import { useState } from 'react';
import { Link2, Copy, Check, Loader2, Calendar, Settings2 } from 'lucide-react';
import { createShortUrl } from '../services/api';
import { useToast } from '../context/ToastContext';
import type { ShortUrl } from '../types';

export default function UrlShortenerForm({ onSuccess }: { onSuccess: () => void }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortUrl | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const isValidUrl = (url: string) => {
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      showToast('error', 'Please enter a URL');
      return;
    }

    if (!isValidUrl(originalUrl)) {
      showToast('error', 'Please enter a valid URL (http:// or https://)');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await createShortUrl({
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim() || undefined,
        expiryDate: expiryDate || undefined,
      });

      setResult(data);
      showToast('success', 'URL shortened successfully!');
      onSuccess();
      setOriginalUrl('');
      setCustomAlias('');
      setExpiryDate('');
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    showToast('success', 'Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Link2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <Settings2 className="w-4 h-4" />
            {showOptions ? 'Hide options' : 'Show options (custom alias, expiry)'}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </div>

        {showOptions && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Custom Alias (optional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
                  /
                </span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="my-link"
                  className="w-full pl-7 pr-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                3-20 chars, alphanumeric only
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Expiry Date (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </form>

      {result && (
        <div className="mt-6 p-5 bg-gradient-to-r from-emerald-900/30 to-gray-800 border border-emerald-700/30 rounded-xl animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400 mb-1">Your shortened URL</p>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold text-emerald-400 hover:text-emerald-300 transition-colors truncate block"
              >
                {result.shortUrl}
              </a>
              <p className="mt-1 text-xs text-gray-500 truncate">
                → {result.originalUrl}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
