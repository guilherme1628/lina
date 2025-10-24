#!/usr/bin/env node

import { Command } from 'commander';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { completeCommand } from './commands/complete';
import { uncompleteCommand } from './commands/uncomplete';
import { deleteCommand } from './commands/delete';
import { configCommand } from './commands/config';
import { startTUI } from './tui';

const program = new Command();

program
  .name('lina')
  .description('A simple CLI task manager')
  .version('1.0.0');

// Add command
program
  .command('add <title>')
  .description('Add a new task')
  .option('-g, --general', 'Add as general task')
  .option('-o, --office', 'Add as office task')
  .option('-p, --project <name>', 'Add as project task with specified project name')
  .action((title, options) => {
    addCommand(title, options);
  });

// List command
program
  .command('list')
  .alias('ls')
  .description('List tasks')
  .option('-a, --all', 'Show all tasks')
  .option('-g, --general', 'Show general tasks')
  .option('-o, --office', 'Show office tasks')
  .option('-p, --project <name>', 'Show tasks for specific project')
  .option('--completed', 'Show only completed tasks')
  .option('--pending', 'Show only pending tasks')
  .action((options) => {
    listCommand(options);
  });

// Complete command
program
  .command('complete <id>')
  .description('Mark a task as completed')
  .action((id) => {
    completeCommand(id);
  });

// Uncomplete command
program
  .command('uncomplete <id>')
  .alias('reopen')
  .description('Mark a completed task as pending')
  .action((id) => {
    uncompleteCommand(id);
  });

// Delete command
program
  .command('delete <id>')
  .alias('remove')
  .description('Delete a task')
  .action((id) => {
    deleteCommand(id);
  });

// Config command
program
  .command('config [action] [key] [value]')
  .description('Manage configuration (get/set storage path)')
  .action((action, key, value) => {
    configCommand(action, key, value);
  });

// Default action: open TUI
program.action(() => {
  startTUI();
});

// Parse arguments
program.parse(process.argv);

// If no command provided, show TUI
if (process.argv.length === 2) {
  startTUI();
}
