import * as blessed from 'blessed';
import { readTasks, updateTask, deleteTask, filterTasks } from '../utils/storage';
import { Task } from '../types';
import { isGitRepo, getProjectName } from '../utils/git';

export function startTUI(): void {
  // Create screen
  const screen = blessed.screen({
    smartCSR: true,
    title: 'Lina Task Manager',
  });

  // Header box
  const header = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: ' {bold}Lina Task Manager{/bold}\n Press {bold}?{/bold} for help, {bold}q{/bold} to quit',
    tags: true,
    border: {
      type: 'line',
    },
  });

  // Filter info box
  const filterInfo = blessed.box({
    top: 3,
    left: 0,
    width: '100%',
    height: 3,
    content: '',
    tags: true,
    border: {
      type: 'line',
    },
  });

  // Task list
  const taskList = blessed.list({
    top: 6,
    left: 0,
    width: '100%',
    height: '100%-9',
    keys: true,
    vi: true,
    mouse: true,
    border: {
      type: 'line',
    },
    style: {
      selected: {
        inverse: true,
      },
    },
    tags: true,
  });

  // Footer with keyboard shortcuts
  const footer = blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: ' {bold}c{/bold}:Complete | {bold}u{/bold}:Uncomplete | {bold}d{/bold}:Delete | {bold}a{/bold}:All | {bold}p{/bold}:Pending | {bold}g{/bold}:General | {bold}o{/bold}:Office | {bold}s{/bold}:Select | {bold}/{/bold}:Search',
    tags: true,
    border: {
      type: 'line',
    },
  });

  screen.append(header);
  screen.append(filterInfo);
  screen.append(taskList);
  screen.append(footer);

  // State
  let currentFilter: any = {};
  let tasks: Task[] = [];

  // Check if we're in a git repo
  if (isGitRepo()) {
    const projectName = getProjectName();
    if (projectName) {
      currentFilter.project = projectName;
    }
  }

  function updateFilterInfo() {
    let filterText = ' Current filter: ';

    if (Object.keys(currentFilter).length === 0) {
      filterText += '{bold}All tasks{/bold}';
    } else {
      const parts: string[] = [];

      if (currentFilter.project) {
        parts.push(`Project: {bold}${currentFilter.project}{/bold}`);
      }
      if (currentFilter.category) {
        parts.push(`Category: {bold}${currentFilter.category}{/bold}`);
      }
      if (currentFilter.status) {
        parts.push(`Status: {bold}${currentFilter.status}{/bold}`);
      }
      if (currentFilter.search) {
        parts.push(`Search: {bold}${currentFilter.search}{/bold}`);
      }

      filterText += parts.join(' | ');
    }

    filterInfo.setContent(filterText);
  }

  function loadTasks() {
    tasks = filterTasks(currentFilter);
    const items = tasks.map(task => {
      const status = task.status === 'completed' ? '✓' : '○';
      const project = task.project ? ` [${task.project}]` : '';
      const category = task.category !== 'project' ? ` (${task.category})` : '';
      return `${status} ${task.title}${project}${category}`;
    });

    taskList.setItems(items);
    updateFilterInfo();
    screen.render();
  }

  // Key bindings
  screen.key(['q', 'C-c'], () => {
    return process.exit(0);
  });

  screen.key(['?', 'h'], () => {
    showHelp();
  });

  taskList.key(['c'], () => {
    const index = (taskList as any).selected;
    const task = tasks[index];

    if (task && task.status === 'pending') {
      updateTask(task.id, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      loadTasks();
    }
  });

  taskList.key(['d'], () => {
    const index = (taskList as any).selected;
    const task = tasks[index];

    if (task) {
      deleteTask(task.id);
      loadTasks();
    }
  });

  taskList.key(['u'], () => {
    const index = (taskList as any).selected;
    const task = tasks[index];

    if (task && task.status === 'completed') {
      updateTask(task.id, {
        status: 'pending',
        completedAt: null,
      });
      loadTasks();
    }
  });

  taskList.key(['a'], () => {
    currentFilter = {};
    loadTasks();
  });

  taskList.key(['p'], () => {
    currentFilter.status = 'pending';
    delete currentFilter.category;
    delete currentFilter.project;
    loadTasks();
  });

  taskList.key(['g'], () => {
    currentFilter.category = 'general';
    delete currentFilter.status;
    delete currentFilter.project;
    loadTasks();
  });

  taskList.key(['o'], () => {
    currentFilter.category = 'office';
    delete currentFilter.status;
    delete currentFilter.project;
    loadTasks();
  });

  taskList.key(['r'], () => {
    if (isGitRepo()) {
      const projectName = getProjectName();
      if (projectName) {
        currentFilter.project = projectName;
        delete currentFilter.category;
        delete currentFilter.status;
        loadTasks();
      }
    }
  });

  taskList.key(['/'], () => {
    promptSearch();
  });

  taskList.key(['s'], () => {
    selectProject();
  });

  function selectProject() {
    // Get all unique projects
    const allTasks = readTasks();
    const projects = Array.from(new Set(
      allTasks
        .filter(t => t.project !== null)
        .map(t => t.project as string)
    )).sort();

    if (projects.length === 0) {
      const msg = blessed.message({
        parent: screen,
        top: 'center',
        left: 'center',
        height: 'shrink',
        width: '50%',
        border: {
          type: 'line',
        },
        label: ' {bold}No Projects{/bold} ',
        tags: true,
      });

      msg.display('No projects found. Create tasks with projects first.', 2, () => {
        taskList.focus();
        screen.render();
      });

      screen.render();
      return;
    }

    const projectList = blessed.list({
      parent: screen,
      top: 'center',
      left: 'center',
      width: '60%',
      height: '60%',
      keys: true,
      vi: true,
      mouse: true,
      border: {
        type: 'line',
      },
      label: ' {bold}Select Project{/bold} ',
      tags: true,
      style: {
        selected: {
          inverse: true,
        },
      },
    });

    projectList.setItems(projects);
    projectList.focus();

    projectList.key(['escape', 'q'], () => {
      screen.remove(projectList);
      taskList.focus();
      screen.render();
    });

    projectList.key(['enter'], () => {
      const index = (projectList as any).selected;
      const selectedProject = projects[index];

      if (selectedProject) {
        currentFilter = { project: selectedProject };
        loadTasks();
      }

      screen.remove(projectList);
      taskList.focus();
      screen.render();
    });

    screen.render();
  }

  function promptSearch() {
    const prompt = blessed.prompt({
      parent: screen,
      top: 'center',
      left: 'center',
      height: 'shrink',
      width: '50%',
      border: {
        type: 'line',
      },
      label: ' {bold}Search tasks{/bold} ',
      tags: true,
      keys: true,
    });

    prompt.input('Enter search term:', '', (err, value) => {
      if (!err && value) {
        currentFilter.search = value;
        loadTasks();
      }
      screen.render();
    });

    screen.render();
  }

  function showHelp() {
    const helpBox = blessed.box({
      parent: screen,
      top: 'center',
      left: 'center',
      width: '80%',
      height: '80%',
      content: `
 {bold}Lina Task Manager - Keyboard Shortcuts{/bold}

 {bold}Navigation:{/bold}
   ↑/k          - Move up
   ↓/j          - Move down
   g            - Go to top
   G            - Go to bottom

 {bold}Actions:{/bold}
   c            - Complete selected task
   u            - Uncomplete selected task
   d            - Delete selected task

 {bold}Filters:{/bold}
   a            - Show all tasks
   p            - Show pending tasks only
   g            - Show general tasks
   o            - Show office tasks
   r            - Show project tasks (current repo)
   s            - Select project from list
   /            - Search tasks

 {bold}Other:{/bold}
   ?/h          - Show this help
   q / Ctrl+C   - Quit

 Press any key to close this help...
      `,
      tags: true,
      border: {
        type: 'line',
      },
    });

    screen.append(helpBox);
    helpBox.focus();

    helpBox.key(['escape', 'q', 'enter'], () => {
      screen.remove(helpBox);
      taskList.focus();
      screen.render();
    });

    screen.render();
  }

  // Focus on task list
  taskList.focus();

  // Initial load
  loadTasks();

  // Render screen
  screen.render();
}
