import axios from "axios";
import { logger } from "../lib/logger";
import { CacheManager } from "../lib/cache";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

interface TTSConfig {
    baseUrl: string;
    timeout: number;
    sessionId?: string;  // 添加session配置
}

interface TTSResult {
    success: boolean;
    url?: string;
    error?: string;
    taskId?: string;
    message: string;
}

interface TTSRequestParams {
    user_uuid_text: string;
    user_input_text: string;
    user_select_language_id: string;
    user_select_announcer_id: string;
    user_select_tts_setting_audio_format: string;
    user_select_tts_setting_speed: string;
    user_select_tts_setting_volume: string;
    user_select_tts_setting_pitch: string;
    user_input_captcha_key: number;
    user_input_captcha_text: number;
    user_input_paragraph_pause_time: string;
    user_select_tts_voice_high_quality: string;
    global_session_id: string;
    user_bgm_config: Record<string, any>;
}

export class TTSService {
    private config: TTSConfig;
    private cache: CacheManager;
    private sessionId: string;

    constructor(config: TTSConfig) {
        this.config = config;
        this.cache = new CacheManager();
        this.sessionId = config.sessionId || "gAAAAABoLqZBfaGoblUf69leF5pk24eGq0ivldFrF45Mq8owlj1Ht41ZNHReN2CWO2d9hIHSFE_PGDn6TFxuxZ_azAI4KnBxyw4KoHqhA95Ik3yGBsyeZmaGG555wcJnX8gdkMO2_ylzACpH1Mpxx3EE6NywO0YkmvpvsNuviadGCoRs6OvQd3c=";
    }

    async generate(text: string, voice: string = 'zh-cn'): Promise<TTSResult> {
        try {
            const cacheKey = `${text}-${voice}`;
            
            // 检查缓存
            const cached = await this.cache.get(cacheKey);
            if (cached) {
                logger.info("Using cached audio for:", cacheKey);
                return cached as TTSResult;
            }

            // 准备请求参数
            const params: TTSRequestParams = {
                user_uuid_text: uuidv4(),
                user_input_text: text,
                user_select_language_id: "zh-cn",
                user_select_announcer_id: "1522", // 默认音色
                user_select_tts_setting_audio_format: "mp3",
                user_select_tts_setting_speed: "1.0",
                user_select_tts_setting_volume: "1",
                user_select_tts_setting_pitch: "1",
                user_input_captcha_key: 8888,
                user_input_captcha_text: 8888,
                user_input_paragraph_pause_time: "0",
                user_select_tts_voice_high_quality: "0",
                global_session_id: this.sessionId,
                user_bgm_config: {}
            };

            // 调用TTSMaker API
            const response = await axios.post(
                `${this.config.baseUrl}/api/create-tts-order`,
                JSON.stringify(params),  // 将参数转换为JSON字符串
                {
                    timeout: this.config.timeout,
                    headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Origin': this.config.baseUrl,
                        'Referer': this.config.baseUrl + '/',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
                        'Cookie': `session_id="${this.sessionId}"; uuid=${uuidv4()}`
                    }
                }
            );
            fs.writeFileSync('tts_response.log', JSON.stringify(response.data, null, 2));

            const result: TTSResult = {
                success: true,
                url: response.data.auto_stand_url,
                message: response.data.errmsg || '音频生成成功'
            };

            // 缓存结果
            await this.cache.set(cacheKey, result);
            
            return result;
        } catch (error: any) {
            logger.error("Failed to generate audio:", error);
            return {
                success: false,
                error: error?.message || "Failed to generate audio",
                message: '音频生成失败'
            };
        }
    }

    async getTaskStatus(taskId: string): Promise<any> {
        try {
            const response = await axios.get(
                `${this.config.baseUrl}/api/get-tts-order-status`,
                {
                    params: { task_id: taskId },
                    timeout: this.config.timeout,
                    headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Origin': this.config.baseUrl,
                        'Referer': this.config.baseUrl + '/',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
                        'Cookie': `session_id="${this.sessionId}"`
                    }
                }
            );
            return response.data;
        } catch (error) {
            logger.error("Failed to get task status:", error);
            throw error;
        }
    }

    async getVoices(): Promise<any[]> {
        try {
            const response = await axios.get(
                `${this.config.baseUrl}/api/get-voice-list`,
                {
                    timeout: this.config.timeout,
                    headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Origin': this.config.baseUrl,
                        'Referer': this.config.baseUrl + '/',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
                        'Cookie': `session_id="${this.sessionId}"`
                    }
                }
            );
            return response.data;
        } catch (error) {
            logger.error("Failed to get voices:", error);
            throw error;
        }
    }
} 