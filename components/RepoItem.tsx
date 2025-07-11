import React, { useState, useCallback } from 'react';
import { GithubRepo } from '../types';
import { fetchRepoReadme, updateRepoDescription, getRepoFileTree, getFileContent, createOrUpdateFile } from '../services/githubService';
import { generateDescriptionFromReadme, isReadmeGeneric, generateReadmeFromFiles } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';

type Status = 
  | 'idle'
  | 'analyzing'
  | 'generating_readme'
  | 'reviewing_readme'
  | 'creating_readme'
  | 'generating_description'
  | 'has_description'
  | 'updating_description'
  | 'error';

const KEY_FILES_PRIORITY = [
  // Package managers
  'package.json', 'composer.json', 'pom.xml', 'build.gradle', 'requirements.txt', 'pyproject.toml', 
  'go.mod', 'Cargo.toml', 'Gemfile', 
  // Configs & Entrypoints
  'Dockerfile', 'docker-compose.yml', 'Makefile',
  'vite.config.js', 'vite.config.ts', 'webpack.config.js', 'next.config.js', 'svelte.config.js',
  // Common main files
  'index.html', 'index.js', 'index.ts', 'index.tsx', 'styles.css', 'style.css',
  'main.py', 'app.py', 'main.go', 'main.rs', 'App.java', 'Program.cs'
];

interface RepoItemProps {
  repo: GithubRepo;
  token: string;
  onUpdateSuccess: (repoId: number) => void;
}

const RepoItem: React.FC<RepoItemProps> = ({ repo, token, onUpdateSuccess }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [generatedDesc, setGeneratedDesc] = useState<string | null>(null);
  const [generatedReadme, setGeneratedReadme] = useState<string | null>(null);
  const [readmeSha, setReadmeSha] = useState<string | undefined>(undefined);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleError = (message: string, newStatus: Status = 'error') => {
    setError(message);
    setStatus(newStatus);
  };

  const generateDescription = useCallback(async (readmeContent: string) => {
    setStatus('generating_description');
    try {
      const description = await generateDescriptionFromReadme(readmeContent);
      setGeneratedDesc(description);
      setStatus('has_description');
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Unknown error generating description.');
    }
  }, []);

  const generateReadme = useCallback(async () => {
    setStatus('generating_readme');
    try {
      const allFiles = await getRepoFileTree(repo.owner.login, repo.name, repo.default_branch, token);
      
      let filesToAnalyze = KEY_FILES_PRIORITY
        .map(fileName => allFiles.find(f => f.path.endsWith(fileName)))
        .filter((file): file is NonNullable<typeof file> => !!file);
      
      // FALLBACK: If no priority files found but repo is not empty, use the first 5 files.
      if (filesToAnalyze.length === 0 && allFiles.length > 0) {
        filesToAnalyze = allFiles.slice(0, 5);
      } else {
        filesToAnalyze = filesToAnalyze.slice(0, 5); // Limit to 5 priority files
      }
      
      const filesWithContentPromises = filesToAnalyze.map(async (file) => {
        try {
          const content = await getFileContent(repo.owner.login, repo.name, file.path, token);
          return { path: file.path, content };
        } catch (e) {
          console.warn(`Could not fetch content for ${file.path}:`, e);
          return null; // Ignore files that can't be read (e.g., binaries)
        }
      });

      const filesWithContent = (await Promise.all(filesWithContentPromises))
        .filter((file): file is { path: string, content: string } => file !== null);

      const readme = await generateReadmeFromFiles(repo.name, filesWithContent);
      setGeneratedReadme(readme);
      setStatus('reviewing_readme');

    } catch (err) {
        handleError(err instanceof Error ? err.message : 'Unknown error generating README.');
    }
  }, [repo, token]);


  const analyzeAndGenerate = useCallback(async () => {
    setStatus('analyzing');
    setError(null);
    try {
      const readmeData = await fetchRepoReadme(repo.owner.login, repo.name, token);
      if (readmeData?.content) {
        setReadmeSha(readmeData.sha);
        const isGeneric = await isReadmeGeneric(readmeData.content);
        if (!isGeneric) {
          await generateDescription(readmeData.content);
        } else {
          await generateReadme();
        }
      } else {
        await generateReadme();
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  }, [repo, token, generateDescription, generateReadme]);

  const handleCreateReadme = async () => {
    if (!generatedReadme) return;
    setStatus('creating_readme');
    try {
        await createOrUpdateFile(
            repo.owner.login,
            repo.name,
            'README.md',
            generatedReadme,
            token,
            'feat: add AI-generated README.md',
            readmeSha
        );
        // Now that the README is created, generate the description from it.
        await generateDescription(generatedReadme);
    } catch (err) {
        handleError(err instanceof Error ? err.message : 'Failed to create README on GitHub.');
    }
  };

  const handleUpdateOnGitHub = useCallback(async () => {
    if (!generatedDesc) return;
    setStatus('updating_description');
    try {
        await updateRepoDescription(repo.owner.login, repo.name, generatedDesc, token);
        onUpdateSuccess(repo.id);
    } catch (err) {
        handleError(err instanceof Error ? err.message : 'An unknown error occurred during update.', 'has_description');
    }
  }, [generatedDesc, repo, token, onUpdateSuccess]);

  const handleCopy = () => {
    if (generatedDesc) {
      navigator.clipboard.writeText(generatedDesc);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const renderStatus = () => {
    const isLoading = ['analyzing', 'generating_readme', 'creating_readme', 'generating_description', 'updating_description'].includes(status);
    const loadingText: { [key in Status]?: string } = {
        analyzing: 'Analyzing repository...',
        generating_readme: 'Reading files & generating README...',
        creating_readme: 'Creating README on GitHub...',
        generating_description: 'Generating description...',
        updating_description: 'Updating on GitHub...',
    };
    
    if (isLoading) {
        return <div className="mt-4 flex items-center justify-center gap-3 p-4 bg-slate-900/70 rounded-md border border-slate-600"><LoadingSpinner /><p className="text-slate-300">{loadingText[status]}</p></div>;
    }
    
    if (status === 'reviewing_readme' && generatedReadme) {
        return (
            <div className="mt-4 p-4 bg-slate-900/70 rounded-md border border-slate-600">
                <p className="text-sm text-amber-400 mb-2 font-semibold">This repo needs a README. We've generated one for you.</p>
                <p className="text-sm text-slate-400 mb-2">Please review it. If it looks good, we'll add it to your repo and then generate the description.</p>
                <textarea readOnly value={generatedReadme} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-200 font-mono resize-y" rows={10} />
                <div className="flex items-center gap-4 mt-3">
                    <button onClick={handleCreateReadme} className="flex items-center gap-2 text-sm px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-md transition duration-200">Confirm & Create README</button>
                    <button onClick={() => setStatus('idle')} className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold">Cancel</button>
                </div>
            </div>
        );
    }
    
    if (status === 'has_description' && generatedDesc) {
        return (
            <div className="mt-4 p-4 bg-slate-900/70 rounded-md border border-slate-600">
                <p className="text-sm text-slate-400 mb-2">AI-Generated Description:</p>
                <textarea readOnly value={generatedDesc} className="w-full bg-transparent text-slate-100 font-mono resize-none border-none p-0 focus:ring-0" rows={Math.max(1, Math.ceil(generatedDesc.length / 70))} />
                <div className="flex items-center gap-4 mt-3">
                    <button onClick={handleUpdateOnGitHub} className="flex items-center gap-2 text-sm px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-md transition duration-200">Update on GitHub</button>
                    <button onClick={handleCopy} className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold">{copySuccess ? 'Copied!' : 'Copy'}</button>
                </div>
            </div>
        );
    }
    return null;
  };
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 transition-shadow hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-bold text-xl text-sky-400 hover:text-sky-300 hover:underline min-w-0 break-words" title={repo.full_name}>{repo.name}</a>
        {status === 'idle' && (
            <button onClick={analyzeAndGenerate} className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-md transition duration-200">
                <SparklesIcon className="w-5 h-5 text-cyan-400" />
                <span>Generate Description</span>
            </button>
        )}
      </div>
      {error && (
        <div className="mt-4 bg-red-900/40 text-red-300 text-sm px-3 py-2 rounded-md">
          <strong>Error:</strong> {error}
          {status === 'error' && <button onClick={() => setStatus('idle')} className="ml-4 font-bold hover:underline">Retry</button>}
        </div>
      )}
      <div className="flex-grow mt-4">
        {renderStatus()}
      </div>
    </div>
  );
};

export default RepoItem;