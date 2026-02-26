/**
 * Funções de formatação para o painel Admin
 */

/**
 * Formata valores monetários em BRL
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado (ex: "R$ 1.234,56")
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata números com separador de milhares
 * @param {number} value - Número a ser formatado
 * @returns {string} Número formatado (ex: "1.234")
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';

  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Formata percentuais
 * @param {number} value - Valor percentual
 * @param {number} decimals - Casas decimais (padrão: 1)
 * @returns {string} Percentual formatado (ex: "12.5%")
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';

  return `${value.toFixed(decimals)}%`;
};

/**
 * Formata datas
 * @param {string|Date} date - Data a ser formatada
 * @param {boolean} includeTime - Incluir hora (padrão: false)
 * @returns {string} Data formatada
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (includeTime) {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Formata data relativa (ex: "há 2 horas")
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data relativa
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) return 'agora mesmo';
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `há ${Math.floor(diffInSeconds / 86400)} dias`;

  return formatDate(dateObj);
};

/**
 * Formata nome abreviado (ex: "João Silva" -> "JS")
 * @param {string} name - Nome completo
 * @returns {string} Iniciais
 */
export const formatInitials = (name) => {
  if (!name) return '?';

  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Formata telefone brasileiro
 * @param {string} phone - Telefone
 * @returns {string} Telefone formatado
 */
export const formatPhone = (phone) => {
  if (!phone) return '-';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }

  return phone;
};

/**
 * Formata CPF
 * @param {string} cpf - CPF
 * @returns {string} CPF formatado
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '-';

  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
  }

  return cpf;
};

/**
 * Formata tamanho de arquivo
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} Tamanho formatado (ex: "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Trunca texto com ellipsis
 * @param {string} text - Texto
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} Texto truncado
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + '...';
};

/**
 * Formata duração em segundos
 * @param {number} seconds - Segundos
 * @returns {string} Duração formatada (ex: "1h 30min")
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  if (secs > 0 && hours === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};
