import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string } }
) {
  try {
    const { owner, repo } = params;
    
    // Fetch repository details using GitHub CLI
    const { stdout: repoInfo } = await execAsync(
      `gh repo view ${owner}/${repo} --json name,description,defaultBranchRef,primaryLanguage,stargazerCount,forkCount,updatedAt,licenseInfo,topics,visibility,isArchived,isDisabled,isFork,isLocked,isMirror,isPrivate,isTemplate`
    );
    
    const repoData = JSON.parse(repoInfo);
    
    return NextResponse.json({
      success: true,
      data: repoData
    });
    
  } catch (error) {
    console.error('Error fetching repo info:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch repository information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
