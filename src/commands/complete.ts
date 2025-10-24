import { findTaskById, updateTask } from '../utils/storage';

export function completeCommand(taskId: string): void {
  if (!taskId || taskId.trim() === '') {
    console.error('Error: Task ID is required');
    process.exit(1);
  }

  const task = findTaskById(taskId);

  if (!task) {
    console.error(`Error: Task with ID "${taskId}" not found`);
    process.exit(1);
  }

  if (task.status === 'completed') {
    console.log(`Task "${task.title}" is already completed`);
    return;
  }

  const success = updateTask(taskId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  });

  if (success) {
    console.log(`✓ Task completed: "${task.title}"`);
  } else {
    console.error('Error: Failed to complete task');
    process.exit(1);
  }
}
