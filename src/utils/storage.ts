import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Task } from '../types';

const LINA_DIR = path.join(os.homedir(), '.lina');
const TASKS_FILE = path.join(LINA_DIR, 'tasks.json');

/**
 * Ensures the .lina directory and tasks.json file exist
 */
export function ensureStorage(): void {
  if (!fs.existsSync(LINA_DIR)) {
    fs.mkdirSync(LINA_DIR, { recursive: true });
  }

  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Reads all tasks from the storage file
 */
export function readTasks(): Task[] {
  ensureStorage();

  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
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
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
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
