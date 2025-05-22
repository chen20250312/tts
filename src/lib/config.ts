import { loadConfig } from './utils/config-loader';

interface ServiceConfig {
    name: string;
    port: number;
    host: string;
}

interface Config {
    service: ServiceConfig;
    tts: {
        baseUrl: string;
        timeout: number;
    };
    cache: {
        dir: string;
        maxSize: number;
        maxAge: number;
    };
}

const defaultConfig: Config = {
    service: {
        name: 'ttsmaker-api',
        port: 8000,
        host: '0.0.0.0'
    },
    tts: {
        baseUrl: 'https://ttsmaker.com',
        timeout: 30000
    },
    cache: {
        dir: './cache',
        maxSize: 1024 * 1024 * 1024, // 1GB
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
};

export const config = loadConfig<Config>('config.yml', defaultConfig); 