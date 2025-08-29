import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string; pr: string } }
) {
  try {
    const { owner, repo, pr } = params;
    
         // Fetch PR details using GitHub CLI
     const { stdout: prInfo } = await execAsync(
       `gh pr view ${pr} --repo ${owner}/${repo} --json title,headRefName,baseRefName,state,mergeable,reviewDecision,additions,deletions,changedFiles,createdAt,updatedAt,closedAt,mergedAt,author,labels,assignees,commits,statusCheckRollup,mergeStateStatus`
     );
    
    const prData = JSON.parse(prInfo);
    
    return NextResponse.json({
      success: true,
      data: prData
    });
    
     } catch (error) {
     console.error('Error fetching PR info:', error);
     
     // Check if it's a "not found" error
     if (error instanceof Error && error.message.includes('no pull requests found')) {
       return NextResponse.json(
         { 
           success: false, 
           error: 'Pull request not found',
           details: 'The specified pull request does not exist or you do not have access to it'
         },
         { status: 404 }
       );
     }
     
     return NextResponse.json(
       { 
         success: false, 
         error: 'Failed to fetch PR information',
         details: error instanceof Error ? error.message : 'Unknown error'
       },
       { status: 500 }
     );
   }
}
