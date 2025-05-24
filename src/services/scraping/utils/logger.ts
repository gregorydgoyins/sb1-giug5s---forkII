import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

export const logError = (message: string, error: unknown): void => {
  logger.error({
    msg: message,
    error: error instanceof Error ? error.message : String(error),
    timestamp: new Date().toISOString()
  });
};

export const logInfo = (message: string, data?: unknown): void => {
  logger.info({
    msg: message,
    data,
    timestamp: new Date().toISOString()
  });
};