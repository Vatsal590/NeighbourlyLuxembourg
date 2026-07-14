type Level = 'debug' | 'info' | 'warn' | 'error'

const LEVELS: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 }
const min: Level = (process.env.LOG_LEVEL as Level) ?? 'info'

function log(level: Level, msg: string, meta?: Record<string, unknown>) {
  if (LEVELS[level] < LEVELS[min]) return
  const line = {
    t: new Date().toISOString(),
    level,
    msg,
    ...(meta ?? {})
  }
  // eslint-disable-next-line no-console
  const writer = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
  writer(JSON.stringify(line))
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => log('debug', msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta)
}
