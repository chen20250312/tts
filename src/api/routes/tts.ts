import { FastifyInstance } from 'fastify';
import { TTSController } from '../controllers/tts';

interface TTSRequest {
    text: string;
    voice?: string;
}

export default async function ttsRoutes(fastify: FastifyInstance) {
    const controller = new TTSController();

    fastify.post<{ Body: TTSRequest }>('/generate', async (request) => {
        return await controller.generateAudio(request.body);
    });

    fastify.get('/voices', async () => {
        return await controller.getVoices();
    });

    fastify.get<{ Params: { taskId: string } }>('/status/:taskId', async (request) => {
        const { taskId } = request.params;
        return await controller.getTaskStatus(taskId);
    });
} 