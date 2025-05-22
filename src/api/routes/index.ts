import { FastifyInstance } from 'fastify';
import ttsRoutes from './tts';
import healthRoutes from './health';

export const routes = {
    async register(app: FastifyInstance) {
        // 注册TTS相关路由
        app.register(ttsRoutes, { prefix: '/api/tts' });
        
        // 注册健康检查路由
        app.register(healthRoutes);
    }
}; 