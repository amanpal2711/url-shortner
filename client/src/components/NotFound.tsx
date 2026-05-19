import { Link } from 'react-router-dom';
import { Ghost, Home, AlertTriangle } from 'lucide-react';

interface NotFoundProps {
  expired?: boolean;
}

export default function NotFound({ expired = false }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          {expired ? (
            <div className="p-4 bg-red-500/10 rounded-full">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
          ) : (
            <div className="p-4 bg-indigo-500/10 rounded-full">
              <Ghost className="w-16 h-16 text-indigo-500 animate-bounce-slow" />
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">
          {expired ? 'Link Expired' : '404 - Not Found'}
        </h1>

        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          {expired
            ? 'This shortened URL has expired and is no longer available.'
            : 'The short URL you\'re looking for doesn\'t exist or has been removed.'}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
