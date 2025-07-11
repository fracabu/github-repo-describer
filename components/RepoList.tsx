import React from 'react';
import { GithubRepo, GithubUser } from '../types';
import RepoItem from './RepoItem';

interface RepoListProps {
  repos: GithubRepo[];
  user: GithubUser;
  token: string;
  onUpdateSuccess: (repoId: number) => void;
}

const RepoList: React.FC<RepoListProps> = ({ repos, user, token, onUpdateSuccess }) => {
  if (repos.length === 0) {
    return (
      <div className="mt-8 text-center bg-slate-800/50 border border-slate-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-slate-200">All Good!</h2>
        <p className="mt-2 text-slate-400">
          We couldn't find any public, non-forked repositories without a description for "{user.login}". Great job keeping things tidy!
        </p>
      </div>
    );
  }

  // Use a responsive grid layout if there are enough items to warrant it.
  const containerClasses = repos.length > 2
    ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
    : 'space-y-4';

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-slate-300 mb-4">
        Found <span className="text-cyan-400">{repos.length}</span> {repos.length === 1 ? 'repository' : 'repositories'} without a description:
      </h2>
      <div className={containerClasses}>
        {repos.map(repo => (
          <RepoItem
            key={repo.id}
            repo={repo}
            token={token}
            onUpdateSuccess={onUpdateSuccess}
          />
        ))}
      </div>
    </div>
  );
};

export default RepoList;