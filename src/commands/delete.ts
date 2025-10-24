import { findTaskById, deleteTask } from '../utils/storage';

export function deleteCommand(taskId: string): void {
  if (!taskId || taskId.trim() === '') {
    console.error('Error: Task ID is required');
    process.exit(1);
  }

  const task = findTaskById(taskId);

  if (!task) {
    console.error(`Error: Task with ID "${taskId}" not found`);
    process.exit(1);
  }

  const success = deleteTask(taskId);

  if (success) {
    console.log(`✓ Task deleted: "${task.title}"`);
  } else {
    console.error('Error: Failed to delete task');
    process.exit(1);
  }
}
