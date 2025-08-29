import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    
    // Get Jira configuration from environment variables
    const jiraDomain = process.env.JIRA_DOMAIN;
    const jiraEmail = process.env.JIRA_EMAIL;
    const jiraApiToken = process.env.JIRA_API_TOKEN;
    
    if (!jiraDomain || !jiraEmail || !jiraApiToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Jira configuration missing',
          details: 'Please set JIRA_DOMAIN, JIRA_EMAIL, and JIRA_API_TOKEN environment variables'
        },
        { status: 500 }
      );
    }
    
    // Fetch Jira task details using REST API
    const response = await fetch(
      `https://${jiraDomain}/rest/api/3/issue/${taskId}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Jira task not found',
            details: 'The specified Jira task does not exist or you do not have access to it'
          },
          { status: 404 }
        );
      }
      
      throw new Error(`Jira API responded with status: ${response.status}`);
    }
    
    const jiraData = await response.json();
    
    // Extract relevant information
    const taskInfo = {
      id: jiraData.id,
      key: jiraData.key,
      summary: jiraData.fields.summary,
      description: jiraData.fields.description,
      status: jiraData.fields.status.name,
      priority: jiraData.fields.priority?.name,
      assignee: jiraData.fields.assignee?.displayName,
      reporter: jiraData.fields.reporter?.displayName,
      created: jiraData.fields.created,
      updated: jiraData.fields.updated,
      issueType: jiraData.fields.issuetype?.name,
      project: jiraData.fields.project?.name,
      labels: jiraData.fields.labels || []
    };
    
    return NextResponse.json({
      success: true,
      data: taskInfo
    });
    
  } catch (error) {
    console.error('Error fetching Jira task info:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Jira task information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
