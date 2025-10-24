import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const LINA_DIR = path.join(os.homedir(), '.lina');
const CONFIG_FILE = path.join(LINA_DIR, 'config.json');

interface Config {
  storage?: string;
}

/**
 * Ensures the .lina directory exists
 */
function ensureLinaDir(): void {
  if (!fs.existsSync(LINA_DIR)) {
    fs.mkdirSync(LINA_DIR, { recursive: true });
  }
}

/**
 * Reads the config file
 */
export function readConfig(): Config {
  ensureLinaDir();

  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }

  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data) as Config;
  } catch (error) {
    console.error('Error reading config file:', error);
    return {};
  }
}

/**
 * Writes the config file
 */
export function writeConfig(config: Config): void {
  ensureLinaDir();

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing config file:', error);
    throw error;
  }
}

/**
 * Gets a config value
 */
export function getConfigValue(key: keyof Config): string | undefined {
  const config = readConfig();
  return config[key];
}

/**
 * Sets a config value
 */
export function setConfigValue(key: keyof Config, value: string): void {
  const config = readConfig();
  config[key] = value;
  writeConfig(config);
}

/**
 * Gets the storage directory path (from config or default)
 */
export function getStorageDir(): string {
  const configPath = getConfigValue('storage');

  if (configPath) {
    // Expand ~ to home directory
    if (configPath.startsWith('~/')) {
      return path.join(os.homedir(), configPath.slice(2));
    }
    return configPath;
  }

  // Default to ~/.lina
  return LINA_DIR;
}

/**
 * Gets the full path to the tasks file
 */
export function getTasksFilePath(): string {
  return path.join(getStorageDir(), 'tasks.json');
}
