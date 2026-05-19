import { useState, useEffect } from 'react';
import { ExternalLink, Trash2, Search, Loader2, MousePointerClick, Calendar, Link2 } from 'lucide-react';
import { getUrls, deleteUrl } from '../services/api';
import { useToast } from '../context/ToastContext';
import type { ShortUrl } from '../types';

export default function UrlTable() {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const { showToast } = useToast();

  const fetchUrls = async () => {
    try {
      const data = await getUrls(search);
      setUrls(data);
    } catch (error) {
      showToast('error', 'Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [search]);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteUrl(id);
      showToast('success', 'URL deleted successfully');
      setUrls((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      showToast('error', 'Failed to delete URL');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? url.slice(0, maxLength) + '...' : url;
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Link2 className="w-5 h-5 text-indigo-400" />
          Your Shortened URLs
        </h2>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search URLs..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : urls.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50 border-dashed">
          <Link2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {search ? 'No URLs match your search' : 'No shortened URLs yet'}
          </p>
          {!search && <p className="text-sm text-gray-500 mt-1">Create your first short URL above!</p>}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Short URL
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
                  Clicks
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {urls.map((url) => (
                <tr
                  key={url.id}
                  className={`bg-gray-800/50 hover:bg-gray-800 transition-colors ${
                    isExpired(url.expiresAt) ? 'opacity-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                      >
                        {url.shortCode}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {url.customAlias && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-indigo-500/20 text-indigo-300 rounded">
                          custom
                        </span>
                      )}
                      {isExpired(url.expiresAt) && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-500/20 text-red-300 rounded">
                          expired
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="group relative">
                      <span className="text-sm text-gray-400">
                        {truncateUrl(url.originalUrl, 40)}
                      </span>
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-gray-300 text-xs p-2 rounded-lg shadow-lg border border-gray-700 max-w-sm break-all">
                          {url.originalUrl}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <MousePointerClick className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-300">
                        {url.clicks.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(url.createdAt)}
                    </div>
                    {url.expiresAt && (
                      <div className="text-xs text-gray-600 mt-0.5">
                        Expires: {formatDate(url.expiresAt)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(url.id)}
                      disabled={deleting === url.id}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete URL"
                    >
                      {deleting === url.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
