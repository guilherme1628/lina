import * as fs from 'fs';
import * as path from 'path';
import { Task } from '../types';
import { getStorageDir, getTasksFilePath } from './config';

/**
 * Ensures the storage directory and tasks.json file exist
 */
export function ensureStorage(): void {
  const storageDir = getStorageDir();
  const tasksFile = getTasksFilePath();

  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  if (!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Reads all tasks from the storage file
 */
export function readTasks(): Task[] {
  ensureStorage();

  try {
    const tasksFile = getTasksFilePath();
    const data = fs.readFileSync(tasksFile, 'utf-8');
    return JSON.parse(data) as Task[];
  } catch (error) {
    console.error('Error reading tasks file:', error);
    return [];
  }
}

/**
 * Writes tasks to the storage file
 */
export function writeTasks(tasks: Task[]): void {
  ensureStorage();

  try {
    const tasksFile = getTasksFilePath();
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing tasks file:', error);
    throw error;
  }
}

/**
 * Adds a new task to storage
 */
export function addTask(task: Task): void {
  const tasks = readTasks();
  tasks.push(task);
  writeTasks(tasks);
}

/**
 * Finds a task by ID
 */
export function findTaskById(id: string): Task | undefined {
  const tasks = readTasks();
  return tasks.find(task => task.id === id);
}

/**
 * Updates a task in storage
 */
export function updateTask(id: string, updates: Partial<Task>): boolean {
  const tasks = readTasks();
  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) {
    return false;
  }

  tasks[index] = { ...tasks[index], ...updates };
  writeTasks(tasks);
  return true;
}

/**
 * Deletes a task from storage
 */
export function deleteTask(id: string): boolean {
  const tasks = readTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);

  if (filteredTasks.length === tasks.length) {
    return false;
  }

  writeTasks(filteredTasks);
  return true;
}

/**
 * Filters tasks based on criteria
 */
export function filterTasks(filter: {
  category?: string;
  project?: string;
  status?: string;
  search?: string;
}): Task[] {
  let tasks = readTasks();

  if (filter.category) {
    tasks = tasks.filter(task => task.category === filter.category);
  }

  if (filter.project) {
    tasks = tasks.filter(task => task.project === filter.project);
  }

  if (filter.status) {
    tasks = tasks.filter(task => task.status === filter.status);
  }

  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchLower)
    );
  }

  return tasks;
}
