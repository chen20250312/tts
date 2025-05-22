import { FastifyInstance } from 'fastify';
import { environment } from '../../lib/environment';

export default async function healthRoutes(fastify: FastifyInstance) {
    fastify.get('/health', async () => {
        return {
            status: 'healthy',
            version: environment.version,
            env: environment.env,
            timestamp: new Date().toISOString()
        };
    });
} 