/**
 * Validadores para o painel Admin
 */

/**
 * Valida email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida telefone brasileiro
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Valida CPF
 * @param {string} cpf
 * @returns {boolean}
 */
export const isValidCPF = (cpf) => {
  if (!cpf) return false;

  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = remainder >= 10 ? 0 : remainder;

  if (digit1 !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = remainder >= 10 ? 0 : remainder;

  return digit2 === parseInt(cleaned.charAt(10));
};

/**
 * Valida senha forte
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('Senha deve ter no mínimo 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter letra maiúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Senha deve conter número');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter caractere especial');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Valida URL
 * @param {string} url
 * @returns {boolean}
 */
export const isValidURL = (url) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida formato de imagem
 * @param {File} file
 * @param {string[]} acceptedFormats
 * @returns {boolean}
 */
export const isValidImageFormat = (file, acceptedFormats = ['image/png', 'image/jpg', 'image/jpeg']) => {
  if (!file) return false;
  return acceptedFormats.includes(file.type);
};

/**
 * Valida tamanho de arquivo
 * @param {File} file
 * @param {number} maxSizeInBytes
 * @returns {boolean}
 */
export const isValidFileSize = (file, maxSizeInBytes) => {
  if (!file) return false;
  return file.size <= maxSizeInBytes;
};

/**
 * Valida campos obrigatórios de um objeto
 * @param {Object} data
 * @param {string[]} requiredFields
 * @returns {{ valid: boolean, missingFields: string[] }}
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    return value === null || value === undefined || value === '';
  });

  return {
    valid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Valida dados de usuário
 * @param {Object} userData
 * @returns {{ valid: boolean, errors: Object }}
 */
export const validateUserData = (userData) => {
  const errors = {};

  // Nome
  if (!userData.nome || userData.nome.trim().length < 3) {
    errors.nome = 'Nome deve ter no mínimo 3 caracteres';
  }

  // Email
  if (!isValidEmail(userData.email)) {
    errors.email = 'Email inválido';
  }

  // Telefone (opcional)
  if (userData.telefone && !isValidPhone(userData.telefone)) {
    errors.telefone = 'Telefone inválido';
  }

  // CPF (opcional)
  if (userData.cpf && !isValidCPF(userData.cpf)) {
    errors.cpf = 'CPF inválido';
  }

  // Senha (se fornecida)
  if (userData.senha) {
    const passwordValidation = validatePassword(userData.senha);
    if (!passwordValidation.valid) {
      errors.senha = passwordValidation.errors;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida dados de empresa
 * @param {Object} companyData
 * @returns {{ valid: boolean, errors: Object }}
 */
export const validateCompanyData = (companyData) => {
  const errors = {};

  // Nome
  if (!companyData.name || companyData.name.trim().length < 3) {
    errors.name = 'Nome deve ter no mínimo 3 caracteres';
  }

  // Email
  if (!isValidEmail(companyData.email)) {
    errors.email = 'Email inválido';
  }

  // Plano
  const validPlans = ['free', 'starter', 'professional', 'enterprise'];
  if (!validPlans.includes(companyData.plan)) {
    errors.plan = 'Plano inválido';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida configurações de banner
 * @param {Object} bannerData
 * @returns {{ valid: boolean, errors: Object }}
 */
export const validateBannerData = (bannerData) => {
  const errors = {};

  // Tipo
  const validTypes = ['info', 'warning', 'success', 'error'];
  if (!validTypes.includes(bannerData.type)) {
    errors.type = 'Tipo de banner inválido';
  }

  // Mensagem
  if (!bannerData.message || bannerData.message.trim().length < 10) {
    errors.message = 'Mensagem deve ter no mínimo 10 caracteres';
  }

  // Ação (se habilitada)
  if (bannerData.action?.enabled) {
    if (!bannerData.action.text || bannerData.action.text.trim().length === 0) {
      errors.actionText = 'Texto do botão é obrigatório';
    }
    if (!bannerData.action.link || !isValidURL(bannerData.action.link)) {
      errors.actionLink = 'Link inválido';
    }
  }

  // Datas (se fornecidas)
  if (bannerData.startDate && bannerData.endDate) {
    const start = new Date(bannerData.startDate);
    const end = new Date(bannerData.endDate);

    if (end <= start) {
      errors.dates = 'Data final deve ser posterior à data inicial';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
