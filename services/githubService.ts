
import { GithubRepo, ReadmeData, GithubUser, GitTreeFile } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

const getAuthHeaders = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
  };
};

export const getAuthenticatedUser = async (token: string): Promise<GithubUser> => {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
        headers: getAuthHeaders(token),
    });
    if (response.status === 401) {
        throw new Error('Invalid or expired GitHub token. Please check your Personal Access Token.');
    }
    if (!response.ok) {
        throw new Error('Could not verify GitHub token.');
    }
    return await response.json();
};

export const fetchUserRepos = async (token: string): Promise<GithubRepo[]> => {
  let allRepos: GithubRepo[] = [];
  let url: string | null = `${GITHUB_API_BASE}/user/repos?per_page=100&type=owner`;

  while (url) {
    const response = await fetch(url, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repositories from GitHub.');
    }

    const data: GithubRepo[] = await response.json();
    allRepos = allRepos.concat(data);

    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
      const nextLink = linkHeader.split(',').find(s => s.includes('rel="next"'));
      if (nextLink) {
        url = nextLink.match(/<([^>]+)>/)?.[1] || null;
      } else {
        url = null;
      }
    } else {
      url = null;
    }
  }

  return allRepos;
};

export const fetchRepoReadme = async (owner: string, repoName: string, token: string): Promise<ReadmeData | null> => {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}/readme`, {
      headers: getAuthHeaders(token)
  });
   if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch README for repository "${repoName}".`);
  }
  const data: ReadmeData = await response.json();
  
  try {
    return { ...data, content: atob(data.content) };
  } catch (e) {
    throw new Error('Failed to decode README content. It might be corrupted.');
  }
};

export const updateRepoDescription = async (owner: string, repoName: string, description: string, token: string): Promise<void> => {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ description }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update repository. Check token permissions (`repo` scope).' }));
        throw new Error(errorData.message || 'Failed to update repository on GitHub.');
    }
};

export const getRepoFileTree = async (owner: string, repoName:string, branch: string, token: string): Promise<GitTreeFile[]> => {
    const branchResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}/branches/${branch}`, {
        headers: getAuthHeaders(token),
    });
    if (!branchResponse.ok) {
        throw new Error(`Could not find default branch '${branch}' for repo ${repoName}.`);
    }
    const branchData = await branchResponse.json();
    const treeSha = branchData.commit.commit.tree.sha;

    const treeResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}/git/trees/${treeSha}?recursive=1`, {
        headers: getAuthHeaders(token),
    });
    if (!treeResponse.ok) {
        throw new Error('Failed to fetch file tree from GitHub.');
    }
    const treeData = await treeResponse.json();
    return treeData.tree.filter((file: GitTreeFile) => file.type === 'blob');
};

export const getFileContent = async (owner: string, repoName: string, filePath: string, token: string): Promise<string> => {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}/contents/${filePath}`, {
        headers: getAuthHeaders(token),
    });
    if (!response.ok) {
        throw new Error(`Could not fetch content for file: ${filePath}`);
    }
    const data = await response.json();
    if (data.encoding !== 'base64') {
        throw new Error(`Unsupported file encoding: ${data.encoding}`);
    }
    return atob(data.content);
};

export const createOrUpdateFile = async (
    owner: string, 
    repoName: string, 
    filePath: string, 
    content: string, 
    token: string, 
    commitMessage: string,
    sha?: string,
): Promise<void> => {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
            message: commitMessage,
            content: btoa(unescape(encodeURIComponent(content))),
            sha,
        }),
    });

    if (response.status !== 201 && response.status !== 200) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create or update file. Check token permissions.' }));
        throw new Error(errorData.message || 'Failed to create or update file on GitHub.');
    }
};