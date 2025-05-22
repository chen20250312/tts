import fs from "fs-extra";
import path from "path";
import { config } from "./config";
import { logger } from "./logger";

export class CacheManager {
    private cacheDir: string;

    constructor() {
        this.cacheDir = config.cache.dir;
        this.ensureCacheDir();
    }

    private ensureCacheDir() {
        fs.ensureDirSync(this.cacheDir);
    }

    private getCachePath(key: string): string {
        return path.join(this.cacheDir, `${key}.json`);
    }

    async get(key: string): Promise<any | null> {
        try {
            const cachePath = this.getCachePath(key);
            if (!fs.existsSync(cachePath)) {
                return null;
            }

            const stats = await fs.stat(cachePath);
            const age = Date.now() - stats.mtimeMs;

            if (age > config.cache.maxAge) {
                await this.delete(key);
                return null;
            }

            const data = await fs.readJson(cachePath);
            return data.value;
        } catch (error) {
            logger.error("Cache read error:", error);
            return null;
        }
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            const cachePath = this.getCachePath(key);
            await fs.writeJson(cachePath, {
                value,
                timestamp: Date.now(),
                ttl: ttl || config.cache.maxAge
            });

            // 检查缓存大小
            await this.checkCacheSize();
        } catch (error) {
            logger.error("Cache write error:", error);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            const cachePath = this.getCachePath(key);
            if (fs.existsSync(cachePath)) {
                await fs.unlink(cachePath);
            }
        } catch (error) {
            logger.error("Cache delete error:", error);
        }
    }

    private async checkCacheSize(): Promise<void> {
        try {
            const files = await fs.readdir(this.cacheDir);
            let totalSize = 0;
            const fileStats = await Promise.all(
                files.map(async (file) => {
                    const filePath = path.join(this.cacheDir, file);
                    const stats = await fs.stat(filePath);
                    totalSize += stats.size;
                    return {
                        path: filePath,
                        stats
                    };
                })
            );

            if (totalSize > config.cache.maxSize) {
                // 按修改时间排序，删除最旧的文件
                fileStats.sort((a, b) => a.stats.mtimeMs - b.stats.mtimeMs);
                
                while (totalSize > config.cache.maxSize && fileStats.length > 0) {
                    const oldestFile = fileStats.shift();
                    if (oldestFile) {
                        await fs.unlink(oldestFile.path);
                        totalSize -= oldestFile.stats.size;
                    }
                }
            }
        } catch (error) {
            logger.error("Cache size check error:", error);
        }
    }
} 