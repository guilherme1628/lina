# Lina - CLI Task Manager

A simple, powerful CLI task manager that helps you organize tasks by project, category, and context.

## Features

- **Context-aware**: Automatically detects git repositories and associates tasks with projects
- **Multiple task categories**: Project, General, and Office tasks
- **Bulk add tasks**: Add multiple tasks at once by separating them with `|`
- **Interactive TUI**: Browse and manage tasks with keyboard shortcuts
- **Project selection**: Easily switch between projects in the TUI
- **CLI commands**: Quick task operations from the command line
- **Single JSON storage**: All tasks stored in `~/.lina/tasks.json`

## Installation

```bash
npm install
npm run build
npm link
```

## Usage

### Interactive TUI Mode

Simply run `lina` to open the interactive interface:

```bash
lina
```

**Keyboard shortcuts in TUI:**
- `↑/↓` or `k/j` - Navigate tasks
- `c` - Complete selected task
- `u` - Uncomplete selected task
- `d` - Delete selected task
- `a` - Show all tasks
- `p` - Show pending tasks only
- `g` - Show general tasks
- `o` - Show office tasks
- `r` - Show current project tasks
- `s` - Select project from list
- `/` - Search tasks
- `?` or `h` - Show help
- `q` or `Ctrl+C` - Quit

### CLI Commands

#### Add Tasks

**In a git repository** (auto-detects project name):
```bash
lina add "frontend bug with decimal numbers"
```

**General task** (any directory):
```bash
lina add -g "buy groceries"
```

**Office task** (any directory):
```bash
lina add -o "send invoice to client"
```

**Project task with specific name** (any directory):
```bash
lina add -p retiq "fix backend auth"
```

**Bulk add tasks** (separate by `|`):
```bash
lina add -g "task one | task two | task three"
lina add -p myapp "implement login | add validation | write tests"
```

#### List Tasks

**List all tasks:**
```bash
lina list -a
# or
lina ls -a
```

**List tasks for current project** (in git repo):
```bash
lina list
```

**List general tasks:**
```bash
lina list -g
```

**List office tasks:**
```bash
lina list -o
```

**List tasks for specific project:**
```bash
lina list -p retiq
```

**List only pending tasks:**
```bash
lina list --pending
```

**List only completed tasks:**
```bash
lina list --completed
```

#### Complete a Task

```bash
lina complete <task-id>
```

Example:
```bash
lina complete b9501c9e-76ac-4c02-9f1c-9daba3a431f7
```

#### Uncomplete a Task

Mark a completed task as pending again:

```bash
lina uncomplete <task-id>
# or
lina reopen <task-id>
```

Example:
```bash
lina uncomplete b9501c9e-76ac-4c02-9f1c-9daba3a431f7
```

#### Delete a Task

```bash
lina delete <task-id>
# or
lina remove <task-id>
```

Example:
```bash
lina delete bff5ca22-bfe2-400a-a1d1-0edb808e75c7
```

#### Configuration

Manage Lina's configuration, including custom storage location.

**View current configuration:**
```bash
lina config
```

**Get a specific config value:**
```bash
lina config get storage
```

**Set custom storage location:**
```bash
lina config set storage ~/Dropbox/lina
# or
lina config set storage ~/path/to/synced/folder
```

This allows you to:
- Store tasks in a Syncthing/Dropbox/cloud folder for multi-device sync
- Keep separate task lists for different purposes
- Back up tasks to a specific location

After changing the storage location, all subsequent task operations will use the new path.

## Task Storage

All tasks are stored in a single JSON file at `~/.lina/tasks.json` by default (customizable via `lina config set storage`).

**Task structure:**
```json
{
  "id": "uuid",
  "title": "task title",
  "status": "pending" | "completed",
  "category": "project" | "general" | "office",
  "project": "project-name" | null,
  "createdAt": "ISO date",
  "completedAt": "ISO date" | null
}
```

## Development

**Build the project:**
```bash
npm run build
```

**Run in development mode:**
```bash
npm run dev
```

**Project structure:**
```
src/
  ├── index.ts           # Main CLI entry point
  ├── types.ts           # TypeScript types
  ├── commands/          # CLI command handlers
  │   ├── add.ts
  │   ├── list.ts
  │   ├── complete.ts
  │   └── delete.ts
  ├── utils/             # Utility functions
  │   ├── storage.ts     # Task storage operations
  │   └── git.ts         # Git repository detection
  └── tui/               # Interactive TUI
      └── index.ts
```

## Tech Stack

- **TypeScript** - Type-safe development
- **Commander** - CLI argument parsing
- **Blessed** - Terminal UI framework
- **UUID** - Unique task IDs

## License

ISC
