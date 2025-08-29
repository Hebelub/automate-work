export interface GitHubPRInfo {
  title: string;
  headRefName: string;
  baseRefName: string;
  state: string;
  mergeable?: string;
  reviewDecision?: string;
  additions?: number;
  deletions?: number;
  changedFiles?: number;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  mergedAt?: string | null;
  mergeStateStatus?: string;
  author?: {
    login: string;
    avatarUrl: string;
  };
  labels?: Array<{
    name: string;
    color: string;
  }>;
  assignees?: Array<{
    login: string;
    avatarUrl: string;
  }>;
  reviewers?: Array<{
    login: string;
    avatarUrl: string;
  }>;
  commits?: {
    totalCount: number;
  };
  statusCheckRollup?: {
    state: string;
    contexts?: Array<{
      name: string;
      state: string;
      conclusion: string;
    }>;
  };
}

export interface GitHubRepoInfo {
  name: string;
  description: string | null;
  defaultBranchRef: {
    name: string;
  };
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
  visibility: string;
  isArchived: boolean;
  isDisabled: boolean;
  isFork: boolean;
  isPrivate: boolean;
}

export interface GitHubBranchInfo {
  name: string;
  commit: {
    sha: string;
    commit: {
      message: string;
      author: {
        name: string;
        email: string;
        date: string;
      };
      committer: {
        name: string;
        email: string;
        date: string;
      };
    };
    author: {
      login: string;
      avatarUrl: string;
    };
    committer: {
      login: string;
      avatarUrl: string;
    };
  };
  protection: {
    enabled: boolean;
    requiredStatusChecks: {
      enforcementLevel: string;
      contexts: string[];
    } | null;
  } | null;
}

export class GitHubService {
  /**
   * Parse GitHub URL to extract owner, repo, and other components
   */
  static parseGitHubUrl(url: string): {
    type: 'pr' | 'repo' | 'branch' | 'issue' | 'unknown';
    owner: string;
    repo: string;
    pr?: string;
    branch?: string;
    issue?: string;
  } | null {
    try {
      const urlObj = new URL(url);
      
      if (urlObj.hostname !== 'github.com') {
        return null;
      }
      
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      if (pathParts.length < 2) {
        return null;
      }
      
      const owner = pathParts[0];
      const repo = pathParts[1];
      
      // Pull Request: /owner/repo/pull/123
      if (pathParts[2] === 'pull' && pathParts[3]) {
        return {
          type: 'pr',
          owner,
          repo,
          pr: pathParts[3]
        };
      }
      
      // Issue: /owner/repo/issues/123
      if (pathParts[2] === 'issues' && pathParts[3]) {
        return {
          type: 'issue',
          owner,
          repo,
          issue: pathParts[3]
        };
      }
      
      // Branch: /owner/repo/tree/branch-name
      if (pathParts[2] === 'tree' && pathParts[3]) {
        return {
          type: 'branch',
          owner,
          repo,
          branch: pathParts[3]
        };
      }
      
      // Repository root: /owner/repo
      if (pathParts.length === 2) {
        return {
          type: 'repo',
          owner,
          repo
        };
      }
      
      return null;
    } catch {
      return null;
    }
  }
  
  /**
   * Fetch PR information from GitHub
   */
  static async fetchPRInfo(owner: string, repo: string, pr: string): Promise<GitHubPRInfo | null> {
    try {
      const response = await fetch(`/api/github/pr/${owner}/${repo}/${pr}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching PR info:', error);
      return null;
    }
  }
  
  /**
   * Fetch repository information from GitHub
   */
  static async fetchRepoInfo(owner: string, repo: string): Promise<GitHubRepoInfo | null> {
    try {
      const response = await fetch(`/api/github/repo/${owner}/${repo}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching repo info:', error);
      return null;
    }
  }
  
  /**
   * Fetch branch information from GitHub
   */
  static async fetchBranchInfo(owner: string, repo: string, branch: string): Promise<GitHubBranchInfo | null> {
    try {
      const response = await fetch(`/api/github/branch/${owner}/${repo}/${branch}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching branch info:', error);
      return null;
    }
  }
  
  /**
   * Fetch all available information for a GitHub URL
   */
  static async fetchGitHubInfo(url: string) {
    const parsed = this.parseGitHubUrl(url);
    
    if (!parsed) {
      return null;
    }
    
    const baseInfo = {
      owner: parsed.owner,
      repo: parsed.repo,
      type: parsed.type
    };
    
    switch (parsed.type) {
      case 'pr':
        const prInfo = await this.fetchPRInfo(parsed.owner, parsed.repo, parsed.pr!);
        return {
          ...baseInfo,
          pr: parsed.pr,
          prInfo
        };
        
      case 'repo':
        const repoInfo = await this.fetchRepoInfo(parsed.owner, parsed.repo);
        return {
          ...baseInfo,
          repoInfo
        };
        
      case 'branch':
        const branchInfo = await this.fetchBranchInfo(parsed.owner, parsed.repo, parsed.branch!);
        return {
          ...baseInfo,
          branch: parsed.branch,
          branchInfo
        };
        
      default:
        return baseInfo;
    }
  }
}
