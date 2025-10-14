// Git API endpoints for DevPanel
// These functions communicate with a local Git server or execute Git commands

export async function gitAdd(): Promise<{ success: boolean; message: string }> {
  try {
    // In a real implementation, this would call a local server or use a Git library
    // For now, we'll use a simple approach with git commands via shell
    
    const response = await fetch('/api/git/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to add files');
    }

    return await response.json();
  } catch (error) {
    console.error('Git add error:', error);
    throw error;
  }
}

export async function gitCommit(): Promise<{ success: boolean; message: string; hash?: string }> {
  try {
    const response = await fetch('/api/git/commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to commit');
    }

    return await response.json();
  } catch (error) {
    console.error('Git commit error:', error);
    throw error;
  }
}

export async function gitPush(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/git/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to push');
    }

    return await response.json();
  } catch (error) {
    console.error('Git push error:', error);
    throw error;
  }
}
