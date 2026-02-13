export const isEnabledRateLimiter = (): boolean => {
  return String(process.env.ENABLE_RATE_LIMITER).toLowerCase() !== 'true';
};
