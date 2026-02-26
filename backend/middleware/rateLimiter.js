import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000; // 1 minuto
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5;

/**
 * Rate limiter para endpoints de autenticação
 * Previne brute force attacks
 */
export const authRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em alguns minutos.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Customizar mensagem com tempo restante
  handler: (req, res) => {
    const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);

    res.status(429).json({
      success: false,
      message: `Muitas tentativas. Tente novamente em ${retryAfter} segundos.`,
      retryAfter,
    });
  },
});

/**
 * Rate limiter genérico para API (mais permissivo)
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Max 100 requests por 15min
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  authRateLimiter,
  apiRateLimiter,
};
