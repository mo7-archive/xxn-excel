import * as fs from 'fs';
import * as path from 'path';

type Level = 'info' | 'warn' | 'error' | 'debug';

function serializeArgs(args: unknown[]): string {
  return args
    .map((a) => {
      if (typeof a === 'string') {
        return a;
      }
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    })
    .join(' ');
}

export interface LogOptions {
  path?: string; // relative to process.cwd()
}

export class Log {
  private baseDir: string;

  constructor(options: LogOptions = {}) {
    const dir = options.path || 'logs';
    this.baseDir = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private getFilePath(level: Level): string {
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const fileName = `${level}-${date}.log`;
    return path.join(this.baseDir, fileName);
  }

  private write(level: Level, args: unknown[]): void {
    const body = serializeArgs(args);
    const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${body}\n`;
    const file = this.getFilePath(level);
    try {
      fs.appendFileSync(file, line, { encoding: 'utf8' });
    } catch (err) {
      try {
        const errFile = path.join(this.baseDir, 'logger-errors.log');
        const errLine = `[${new Date().toISOString()}] ERROR 写日志失败 ${String(err)}\n`;
        fs.appendFileSync(errFile, errLine, { encoding: 'utf8' });
      } catch (e) {
        void e;
      }
    }
  }

  info(...args: unknown[]) {
    this.write('info', args);
  }
  warn(...args: unknown[]) {
    this.write('warn', args);
  }
  error(...args: unknown[]) {
    this.write('error', args);
  }
  debug(...args: unknown[]) {
    this.write('debug', args);
  }
}

export default Log;

/*
Usage Example:

import Log from './logger';

// Create logger instance (directory relative to project root)
const logger = new Log({ path: 'logs' });

// Logs will be written to:
// logs/info-YYYY-MM-DD.log
// logs/warn-YYYY-MM-DD.log
// logs/error-YYYY-MM-DD.log
// logs/debug-YYYY-MM-DD.log

logger.info('任务开始', { jobId: 123 });
logger.warn('这是一个警告，注意检查');
logger.error('发生错误：', new Error('示例错误'));
logger.debug('调试信息', { a: 1, b: [1,2,3] });

// 如果日志文件不存在，logger 会自动创建对应目录与文件。
*/
