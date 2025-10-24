import { readConfig, setConfigValue, getConfigValue, getStorageDir, getTasksFilePath } from '../utils/config';

export function configCommand(action?: string, key?: string, value?: string): void {
  if (!action) {
    // Show all config
    const config = readConfig();
    console.log('Current configuration:');
    console.log(JSON.stringify(config, null, 2));
    console.log('');
    console.log(`Storage directory: ${getStorageDir()}`);
    console.log(`Tasks file: ${getTasksFilePath()}`);
    return;
  }

  if (action === 'get') {
    if (!key) {
      console.error('Error: Key is required for "get" action');
      console.log('Usage: lina config get <key>');
      process.exit(1);
    }

    const val = getConfigValue(key as any);
    if (val === undefined) {
      console.log(`Config key "${key}" is not set (using default)`);
    } else {
      console.log(`${key}: ${val}`);
    }
    return;
  }

  if (action === 'set') {
    if (!key || !value) {
      console.error('Error: Key and value are required for "set" action');
      console.log('Usage: lina config set <key> <value>');
      process.exit(1);
    }

    if (key !== 'storage') {
      console.error(`Error: Unknown config key "${key}"`);
      console.log('Available keys: storage');
      process.exit(1);
    }

    setConfigValue(key, value);
    console.log(`✓ Config updated: ${key} = ${value}`);
    console.log('');
    console.log(`Storage directory: ${getStorageDir()}`);
    console.log(`Tasks file: ${getTasksFilePath()}`);
    return;
  }

  console.error(`Error: Unknown action "${action}"`);
  console.log('Available actions: get, set');
  console.log('');
  console.log('Examples:');
  console.log('  lina config                    # Show all config');
  console.log('  lina config get storage        # Get storage path');
  console.log('  lina config set storage ~/Dropbox/lina   # Set custom storage path');
  process.exit(1);
}
