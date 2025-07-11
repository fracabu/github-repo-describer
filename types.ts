
export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  owner: {
    login: string;
  };
  default_branch: string;
}

export interface ReadmeData {
  content: string;
  sha: string;
}

export interface GithubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
}

export interface GitTreeFile {
    path: string;
    type: 'blob' | 'tree';
    sha: string;
    size?: number;
}