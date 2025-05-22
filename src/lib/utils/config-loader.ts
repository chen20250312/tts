import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';
import { logger } from '../logger';

export function loadConfig<T>(configPath: string, defaultConfig: T): T {
    try {
        const configFile = path.resolve(process.cwd(), configPath);
        
        if (!fs.existsSync(configFile)) {
            logger.warn(`Config file not found: ${configPath}, using default config`);
            return defaultConfig;
        }

        const content = fs.readFileSync(configFile, 'utf8');
        const config = yaml.parse(content) as T;

        return {
            ...defaultConfig,
            ...config
        };
    } catch (error) {
        logger.error('Failed to load config:', error);
        return defaultConfig;
    }
} 