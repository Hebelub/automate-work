export interface JiraTaskInfo {
  id: string;
  key: string;
  summary: string;
  description?: string;
  status: string;
  priority?: string;
  assignee?: string;
  reporter?: string;
  created: string;
  updated: string;
  issueType: string;
  project: string;
  labels: string[];
}

export class JiraService {
  /**
   * Parse Jira URL to extract task ID and domain
   */
  static parseJiraUrl(url: string): {
    domain: string;
    taskId: string;
  } | null {
    try {
      const urlObj = new URL(url);
      
      // Check if it's a Jira domain
      if (!urlObj.hostname.includes('atlassian.net') && !urlObj.hostname.includes('jira')) {
        return null;
      }
      
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      // Look for the task ID in the path
      // Common patterns: /browse/TASK-123, /issues/TASK-123, /TASK-123
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        // Check if this part looks like a Jira task ID (e.g., TASK-123, PROJ-456)
        if (/^[A-Z]+-\d+$/.test(part)) {
          return {
            domain: urlObj.hostname,
            taskId: part
          };
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }
  
  /**
   * Fetch Jira task information
   */
  static async fetchJiraTaskInfo(url: string): Promise<JiraTaskInfo | null> {
    try {
      const parsed = this.parseJiraUrl(url);
      
      if (!parsed) {
        return null;
      }
      
      const response = await fetch(`/api/jira/task/${parsed.taskId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching Jira task info:', error);
      return null;
    }
  }
}
