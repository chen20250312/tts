interface Environment {
    version: string;
    env: string;
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
}

const pkg = await import('../../package.json', { assert: { type: 'json' } });

export const environment: Environment = {
    version: pkg.default.version,
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test'
}; 