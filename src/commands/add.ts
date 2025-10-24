import { v4 as uuidv4 } from 'uuid';
import { Task, TaskCategory } from '../types';
import { addTask } from '../utils/storage';
import { isGitRepo, getProjectName } from '../utils/git';

interface AddOptions {
  general?: boolean;
  office?: boolean;
  project?: string;
}

export function addCommand(title: string, options: AddOptions): void {
  if (!title || title.trim() === '') {
    console.error('Error: Task title cannot be empty');
    process.exit(1);
  }

  // Split by "|" for bulk add
  const titles = title.split('|').map(t => t.trim()).filter(t => t !== '');

  if (titles.length === 0) {
    console.error('Error: No valid task titles found');
    process.exit(1);
  }

  let category: TaskCategory;
  let project: string | null = null;

  // Determine category and project based on flags and context
  if (options.general) {
    category = 'general';
  } else if (options.office) {
    category = 'office';
  } else if (options.project) {
    category = 'project';
    project = options.project;
  } else if (isGitRepo()) {
    // Default: if in git repo, create project task
    category = 'project';
    project = getProjectName();
  } else {
    console.error('Error: Not in a git repository. Use -g (general), -o (office), or -p <project> flag.');
    process.exit(1);
  }

  // Add all tasks
  const addedTasks: Task[] = [];

  for (const taskTitle of titles) {
    const task: Task = {
      id: uuidv4(),
      title: taskTitle,
      status: 'pending',
      category,
      project,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    addTask(task);
    addedTasks.push(task);
  }

  // Show summary
  console.log(`✓ ${addedTasks.length} task(s) added`);
  if (project) {
    console.log(`  Project: ${project}`);
  }
  console.log(`  Category: ${category}`);
  console.log('');

  addedTasks.forEach(task => {
    console.log(`  • "${task.title}" (ID: ${task.id})`);
  });
}
