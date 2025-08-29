export interface ActionPoint {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  type: 'github' | 'jira';
}

export interface GitHubPRInfo {
  state: string;
  mergeable?: string;
  reviewDecision?: string;
  mergedAt?: string | null;
}

export interface JiraTaskInfo {
  status: string;
  summary: string;
}

export function getActionPointsForLinks(
  links: Array<{
    url: string;
    githubInfo?: GitHubPRInfo | null;
    jiraInfo?: JiraTaskInfo | null;
  }>
): ActionPoint[] {
  const actionPoints: ActionPoint[] = [];
  let actionId = 1;

  links.forEach((link) => {
    // GitHub PR Action Points
    if (link.githubInfo && isGitHubUrl(link.url)) {
      const pr = link.githubInfo;
      
      // Check if PR needs review
      if (pr.state === 'OPEN' && (!pr.reviewDecision || pr.reviewDecision === 'REQUIRED')) {
        actionPoints.push({
          id: `action-${actionId++}`,
          text: 'Get review',
          priority: 'high',
          type: 'github'
        });
      }
      
      // Check if PR can be merged
      if (pr.state === 'OPEN' && pr.mergeable === 'MERGEABLE' && pr.reviewDecision === 'APPROVED' && !pr.mergedAt) {
        actionPoints.push({
          id: `action-${actionId++}`,
          text: 'Merge',
          priority: 'medium',
          type: 'github'
        });
      }
      
      // Check if PR is already merged
      if (pr.mergedAt) {
        actionPoints.push({
          id: `action-${actionId++}`,
          text: 'Already merged ✓',
          priority: 'low',
          type: 'github'
        });
      }
      
      // Check if PR is closed but not merged
      if (pr.state === 'CLOSED' && !pr.mergedAt) {
        actionPoints.push({
          id: `action-${actionId++}`,
          text: 'PR was closed without merging',
          priority: 'low',
          type: 'github'
        });
      }
    }
    
    // Jira Task Action Points
    if (link.jiraInfo && isJiraUrl(link.url)) {
      const task = link.jiraInfo;
      const status = task.status.toLowerCase();
      
      // Check if task is in QA
      if (status.includes('qa') || status.includes('testing') || status.includes('test')) {
        actionPoints.push({
          id: `action-${actionId++}`,
          text: 'Needs testing',
          priority: 'high',
          type: 'jira'
        });
      }
      
      // Check if task is ready for production
      if (status.includes('ready') || status.includes('done') || status.includes('complete') || status.includes('approved')) {
        actionPoints.push({
          id: `action-${actionId++}`,
          text: 'Merge all code',
          priority: 'medium',
          type: 'jira'
        });
      }
      
      // Check if task is in development
      if (status.includes('in progress') || status.includes('development') || status.includes('coding')) {
        actionPoints.push({
          id: `action-${actionId++}`,
          text: 'Continue development',
          priority: 'medium',
          type: 'jira'
        });
      }
      
      // Check if task is blocked
      if (status.includes('blocked') || status.includes('waiting') || status.includes('pending')) {
        actionPoints.push({
          id: `action-${actionId++}`,
          text: 'Unblock task',
          priority: 'high',
          type: 'jira'
        });
      }
    }
  });

  return actionPoints;
}

function isGitHubUrl(url: string): boolean {
  return url.includes('github.com') || url.includes('githubusercontent.com');
}

function isJiraUrl(url: string): boolean {
  return url.includes('atlassian.net') || url.includes('jira');
}
