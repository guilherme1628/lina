import { filterTasks } from '../utils/storage';
import { isGitRepo, getProjectName } from '../utils/git';
import { Task } from '../types';

interface ListOptions {
  all?: boolean;
  general?: boolean;
  office?: boolean;
  project?: string;
  completed?: boolean;
  pending?: boolean;
}

export function listCommand(options: ListOptions): void {
  let filter: any = {};

  // Determine filter based on flags and context
  if (options.all) {
    // Show all tasks
  } else if (options.general) {
    filter.category = 'general';
  } else if (options.office) {
    filter.category = 'office';
  } else if (options.project) {
    filter.project = options.project;
  } else if (isGitRepo()) {
    // Default: if in git repo, show project tasks
    const projectName = getProjectName();
    if (projectName) {
      filter.project = projectName;
    }
  }

  // Filter by status
  if (options.completed) {
    filter.status = 'completed';
  } else if (options.pending) {
    filter.status = 'pending';
  }

  const tasks = filterTasks(filter);

  if (tasks.length === 0) {
    console.log('No tasks found.');
    return;
  }

  // Group tasks by status
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  if (pendingTasks.length > 0) {
    console.log('\n=== Pending Tasks ===\n');
    pendingTasks.forEach(task => printTask(task));
  }

  if (completedTasks.length > 0) {
    console.log('\n=== Completed Tasks ===\n');
    completedTasks.forEach(task => printTask(task));
  }

  console.log(`\nTotal: ${tasks.length} tasks (${pendingTasks.length} pending, ${completedTasks.length} completed)`);
}

function printTask(task: Task): void {
  const status = task.status === 'completed' ? '✓' : '○';
  const project = task.project ? ` [${task.project}]` : '';
  const category = task.category !== 'project' ? ` (${task.category})` : '';

  console.log(`${status} ${task.title}${project}${category}`);
  console.log(`  ID: ${task.id} | Created: ${formatDate(task.createdAt)}`);
  if (task.completedAt) {
    console.log(`  Completed: ${formatDate(task.completedAt)}`);
  }
  console.log('');
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
