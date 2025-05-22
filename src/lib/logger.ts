import colors from "colors";
import { config } from "./config";
import fs from "fs-extra";
import path from "path";

class Logger {
    private logDir: string;

    constructor() {
        this.logDir = path.join(process.cwd(), "logs");
        this.ensureLogDir();
    }

    private ensureLogDir() {
        fs.ensureDirSync(this.logDir);
    }

    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private log(level: string, ...args: any[]) {
        const timestamp = this.getTimestamp();
        const message = args.map(arg => 
            typeof arg === "object" ? JSON.stringify(arg) : arg
        ).join(" ");

        const logLine = `[${timestamp}] [${level}] ${message}\n`;
        
        // 控制台输出
        let coloredLevel = level;
        switch (level) {
            case "ERROR":
                coloredLevel = colors.red(level);
                break;
            case "WARN":
                coloredLevel = colors.yellow(level);
                break;
            case "INFO":
                coloredLevel = colors.green(level);
                break;
            case "DEBUG":
                coloredLevel = colors.blue(level);
                break;
        }
        console.log(`[${timestamp}] [${coloredLevel}] ${message}`);

        // 写入文件
        const logFile = path.join(this.logDir, `${level.toLowerCase()}.log`);
        fs.appendFileSync(logFile, logLine);
    }

    error(...args: any[]) {
        this.log("ERROR", ...args);
    }

    warn(...args: any[]) {
        this.log("WARN", ...args);
    }

    info(...args: any[]) {
        this.log("INFO", ...args);
    }

    debug(...args: any[]) {
        this.log("DEBUG", ...args);
    }

    success(...args: any[]) {
        this.log("SUCCESS", ...args);
    }
}

export const logger = new Logger(); 