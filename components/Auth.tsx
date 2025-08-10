import React, { useState } from 'react';
import { GitHubIcon } from './icons/GitHubIcon';

interface AuthProps {
  onLogin: (token: string) => void;
  isLoading: boolean;
  error: string | null;
}

const Auth: React.FC<AuthProps> = ({ onLogin, isLoading, error }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(token);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-8 bg-slate-800 rounded-lg border border-slate-700 shadow-xl">
      <div className="flex items-center justify-center mb-6">
        <GitHubIcon className="w-10 h-10 text-slate-300 mr-4" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
            GitHub Repo Describer
        </h1>
      </div>
      
      <p className="text-center text-slate-400 mb-6">
        This app requires both a GitHub Personal Access Token and a Google Gemini API key to function.
      </p>

      <div className="bg-slate-900 p-4 rounded-md mb-4 text-sm">
        <h3 className="font-semibold text-slate-200 mb-2">📝 Setup Requirements:</h3>
        
        <div className="mb-4">
          <h4 className="font-medium text-slate-300 mb-2">1. Google Gemini API Key (Required)</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-400 ml-2">
            <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google AI Studio</a></li>
            <li>Click "Create API Key" and copy it</li>
            <li>Add it to your <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded-sm text-xs">.env.local</code> file as <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded-sm text-xs">GEMINI_API_KEY=your_key</code></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-slate-300 mb-2">2. GitHub Personal Access Token</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-400 ml-2">
            <li>Go to <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">GitHub Tokens page</a></li>
            <li>Give your token a name (e.g., "Repo Describer")</li>
            <li>Select the <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded-sm text-xs">repo</code> scope</li>
            <li>Click "Generate token" and paste it below</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_..."
          className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition duration-200"
          disabled={isLoading}
          aria-label="GitHub Personal Access Token"
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={isLoading || !token}
          className="w-full mt-4 flex justify-center items-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-200"
        >
          {isLoading ? 'Authenticating...' : 'Connect to GitHub'}
        </button>
      </form>
      {error && (
        <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm text-center">
            <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Auth;