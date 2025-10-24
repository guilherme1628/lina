export type TaskStatus = 'pending' | 'completed';

export type TaskCategory = 'project' | 'general' | 'office';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  category: TaskCategory;
  project: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface TaskFilter {
  category?: TaskCategory;
  project?: string;
  status?: TaskStatus;
  search?: string;
}
