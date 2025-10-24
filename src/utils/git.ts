import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * Checks if the current directory is inside a git repository
 */
export function isGitRepo(): boolean {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the root directory of the current git repository
 */
export function getGitRoot(): string | null {
  try {
    const root = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' });
    return root.trim();
  } catch {
    return null;
  }
}

/**
 * Gets the project name from the git repository folder name
 */
export function getProjectName(): string | null {
  const gitRoot = getGitRoot();

  if (!gitRoot) {
    return null;
  }

  return path.basename(gitRoot);
}
