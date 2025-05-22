import { TTSService } from '../../services/tts';
import { logger } from '../../lib/logger';
import { config } from '../../lib/config';

interface TTSRequest {
    text: string;
    voice?: string;
}

interface TTSResponse {
    success: boolean;
    url?: string;
    message?: string;
}

export class TTSController {
    private service: TTSService;

    constructor() {
        this.service = new TTSService(config.tts);
    }

    async generateAudio(request: TTSRequest): Promise<TTSResponse> {
        try {
            const result = await this.service.generate(
                request.text,
                request.voice
            );
            
            if (!result.success) {
                return {
                    success: false,
                    message: result.error || '生成音频失败'
                };
            }

            return {
                success: true,
                url: result.url,
                message: '音频生成成功'
            };
        } catch (error: any) {
            logger.error('生成音频失败:', error);
            return {
                success: false,
                message: error?.message || '生成音频失败'
            };
        }
    }

    async getVoices(): Promise<Voice[]> {
        try {
            return await this.service.getVoices();
        } catch (error) {
            logger.error("Failed to get voices:", error);
            throw error;
        }
    }

    async getTaskStatus(taskId: string): Promise<any> {
        try {
            return await this.service.getTaskStatus(taskId);
        } catch (error) {
            logger.error("Failed to get task status:", error);
            throw error;
        }
    }
} 