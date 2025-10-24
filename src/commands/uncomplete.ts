import { findTaskById, updateTask } from '../utils/storage';

export function uncompleteCommand(taskId: string): void {
  if (!taskId || taskId.trim() === '') {
    console.error('Error: Task ID is required');
    process.exit(1);
  }

  const task = findTaskById(taskId);

  if (!task) {
    console.error(`Error: Task with ID "${taskId}" not found`);
    process.exit(1);
  }

  if (task.status === 'pending') {
    console.log(`Task "${task.title}" is already pending`);
    return;
  }

  const success = updateTask(taskId, {
    status: 'pending',
    completedAt: null,
  });

  if (success) {
    console.log(`✓ Task reopened: "${task.title}"`);
  } else {
    console.error('Error: Failed to reopen task');
    process.exit(1);
  }
}
