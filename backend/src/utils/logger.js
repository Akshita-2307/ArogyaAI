const isProd = process.env.NODE_ENV === 'production';

function safeString(value, maxLen = 200) {
  if (typeof value !== 'string') return value;
  // Avoid logging long free-text that may contain PHI.
  if (isProd) return '[redacted]';
  if (value.length <= maxLen) return value;
  return value.slice(0, maxLen) + '...';
}

function formatArgs(args) {
  return args.map((a) => {
    if (typeof a === 'string') return safeString(a);
    if (a && typeof a === 'object') {
      // In prod, avoid dumping arbitrary objects (may contain PHI/tokens).
      if (isProd) return '[redacted_object]';
    }
    return a;
  });
}

const logger = {
  debug: (...args) => {
    if (!isProd) console.log(...formatArgs(args));
  },
  info: (...args) => {
    console.log(...formatArgs(args));
  },
  warn: (...args) => {
    console.warn(...formatArgs(args));
  },
  error: (...args) => {
    console.error(...formatArgs(args));
  },
};

module.exports = logger;

