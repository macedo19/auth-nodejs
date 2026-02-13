export const rateLimiterConfig = {
  limit: Number(process.env.RATE_LIMITER_POINTS) || 10,
  duration: Number(process.env.RATE_LIMITER_DURATION) || 60000,
};

export const isEnabledRateLimiter = (): boolean => {
  return String(process.env.ENABLE_RATE_LIMITER).toLowerCase() !== 'true';
};
