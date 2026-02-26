import Joi from 'joi';

/**
 * Schema de validação para registro
 */
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter no mínimo 2 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
  }),

  email: Joi.string().email().required().messages({
    'string.empty': 'Email é obrigatório',
    'string.email': 'Email inválido',
  }),

  password: Joi.string().min(8).max(128).required().messages({
    'string.empty': 'Senha é obrigatória',
    'string.min': 'Senha deve ter no mínimo 8 caracteres',
    'string.max': 'Senha deve ter no máximo 128 caracteres',
  }),
});

/**
 * Schema de validação para login
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email é obrigatório',
    'string.email': 'Email inválido',
  }),

  password: Joi.string().required().messages({
    'string.empty': 'Senha é obrigatória',
  }),
});

/**
 * Schema de validação para refresh token
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token é obrigatório',
  }),
});

/**
 * Validar dados com schema
 */
export const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false, // Retorna todos os erros, não só o primeiro
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }));

    return { errors, value: null };
  }

  return { errors: null, value };
};

export default {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  validate,
};
