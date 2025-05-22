import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { logger } from './lib/logger';
import { config } from './lib/config';
import { environment } from './lib/environment';
import { routes } from './api/routes';

const startupTime = performance.now();

async function main() {
    logger.info('<<<< TTSMaker API Server >>>>');
    logger.info('Version:', environment.version);
    logger.info('Environment:', environment.env);
    logger.info('Service name:', config.service.name);

    const app = fastify({
        logger: true
    });

    // 启用CORS
    await app.register(cors, {
        origin: true
    });

    // 配置Swagger
    await app.register(swagger, {
        swagger: {
            info: {
                title: 'TTSMaker API',
                description: 'TTSMaker 文字转语音 API',
                version: environment.version
            }
        }
    });

    await app.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        }
    });

    // 根路由
    app.get('/', async () => {
        return {
            name: config.service.name,
            version: environment.version,
            docs: '/docs',
            status: 'healthy'
        };
    });

    // 注册路由
    await routes.register(app);

    return app;
}

if (import.meta.url === new URL(import.meta.url).href) {
    main()
        .then((app) => {
            const port = config.service.port || 8000;
            app.listen({ port, host: '0.0.0.0' }, (err) => {
                if (err) {
                    logger.error('Service startup failed:', err);
                    process.exit(1);
                }
                logger.success(
                    `Service startup completed (${Math.floor(performance.now() - startupTime)}ms)`
                );
                logger.success(`Server running at http://localhost:${port}`);
            });
        })
        .catch((err) => {
            logger.error('Service startup failed:', err);
            process.exit(1);
        });
} 