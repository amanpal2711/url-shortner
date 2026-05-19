import { useState } from 'react';
import { Scissors, Github, ExternalLink } from 'lucide-react';
import UrlShortenerForm from './components/UrlShortenerForm';
import UrlTable from './components/UrlTable';
import { ToastProvider } from './context/ToastContext';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">URL Shortener</h1>
                  <p className="text-xs text-gray-400">Shorten, track, and manage your links</p>
                </div>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Shorten your URLs in seconds
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Create short, memorable links with custom aliases and expiration dates.
              Track clicks and manage all your links in one place.
            </p>
          </div>

          {/* URL Shortener Form */}
          <div className="mb-12">
            <UrlShortenerForm onSuccess={handleSuccess} />
          </div>

          {/* Dashboard */}
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6 sm:p-8">
            <UrlTable key={refreshKey} />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Built with React + Node.js + SQLite
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>API runs on :3001</span>
                <span className="hidden sm:inline">•</span>
                <a
                  href="http://localhost:3001/api/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Health Check
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}

export default App;
