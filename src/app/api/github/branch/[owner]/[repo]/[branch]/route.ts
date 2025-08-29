import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string; branch: string } }
) {
  try {
    const { owner, repo, branch } = params;
    
    // Fetch branch details using GitHub CLI
    const { stdout: branchInfo } = await execAsync(
      `gh api repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`
    );
    
    const branchData = JSON.parse(branchInfo);
    
    // Get additional commit information
    const { stdout: commitInfo } = await execAsync(
      `gh api repos/${owner}/${repo}/commits/${branchData.commit.sha}`
    );
    
    const commitData = JSON.parse(commitInfo);
    
    return NextResponse.json({
      success: true,
      data: {
        ...branchData,
        commit: commitData
      }
    });
    
  } catch (error) {
    console.error('Error fetching branch info:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch branch information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
