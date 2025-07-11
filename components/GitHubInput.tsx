
import React, { useState } from 'react';

interface GitHubInputProps {
  onFetch: (username: string) => void;
  isLoading: boolean;
}

const GitHubInput: React.FC<GitHubInputProps> = ({ onFetch, isLoading }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFetch(username);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 mt-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your GitHub username"
        className="w-full flex-grow bg-slate-800 border border-slate-600 rounded-md px-4 py-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition duration-200"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto flex justify-center items-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition duration-200"
      >
        {isLoading ? 'Searching...' : 'Fetch Repos'}
      </button>
    </form>
  );
};

export default GitHubInput;
