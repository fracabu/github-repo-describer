import React, { useState, useCallback } from 'react';
import { GithubRepo, GithubUser } from './types';
import { fetchUserRepos, getAuthenticatedUser } from './services/githubService';
import RepoList from './components/RepoList';
import Auth from './components/Auth';
import { LoadingSpinner } from './components/icons/LoadingSpinner';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = token && user;

  const handleLogin = useCallback(async (newToken: string) => {
    if (!newToken) {
      setError('Please provide a token.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const authenticatedUser = await getAuthenticatedUser(newToken);
      setUser(authenticatedUser);
      setToken(newToken);
      const allRepos = await fetchUserRepos(newToken);
      const reposWithoutDescription = allRepos.filter(repo => !repo.description && !repo.fork);
      setRepos(reposWithoutDescription);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during authentication.');
      }
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setRepos([]);
    setError(null);
  };

  const handleUpdateSuccess = (repoId: number) => {
    setRepos(prevRepos => prevRepos.filter(repo => repo.id !== repoId));
  };
  
  const renderContent = () => {
    if (isLoading && !isAuthenticated) {
      return <Auth onLogin={handleLogin} isLoading={true} error={error} />;
    }
    
    if (!isAuthenticated) {
      return <Auth onLogin={handleLogin} isLoading={false} error={error} />;
    }

    if (isLoading) {
       return (
        <div className="flex justify-center items-center mt-8 space-x-3">
            <LoadingSpinner />
            <p className="text-lg text-slate-400">Refreshing repositories...</p>
        </div>
       );
    }

    return (
        <RepoList
            repos={repos}
            user={user}
            token={token}
            onUpdateSuccess={handleUpdateSuccess}
        />
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto flex flex-col flex-grow">
        <div className="flex-grow">
            {isAuthenticated && user && (
                <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700 mb-6">
                    <div className="flex items-center gap-3">
                        <img src={user.avatar_url} alt={user.login} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-bold text-slate-200">{user.name || user.login}</p>
                            <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-400 hover:underline">
                                @{user.login}
                            </a>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 transition"
                    >
                        Logout
                    </button>
                </div>
            )}
            <main>
              {renderContent()}
            </main>
        </div>
      </div>
    </div>
  );
};

export default App;