export interface Voice {
    id: string;
    name: string;
    language: string;
    gender: 'male' | 'female';
    style?: string;
    sample_url?: string;
}

export interface TTSRequest {
    text: string;
    voice_id: string;
    speed?: number;
    volume?: number;
}

export interface TTSResponse {
    success: boolean;
    url?: string;
    message?: string;
    task_id?: string;
}

export interface TaskStatus {
    state: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    result?: {
        url: string;
        duration: number;
    };
    error?: string;
} 