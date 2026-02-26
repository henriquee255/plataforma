/**
 * Funções auxiliares do painel Admin
 */

import { PLAN_INFO } from './constants';

/**
 * Retorna a cor do status
 * @param {string} status
 * @returns {string} Classes Tailwind
 */
export const getStatusColor = (status) => {
  const colors = {
    'Ativo': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Ativa': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Suspenso': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Suspensa': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Inativo': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    'Inativa': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    'Pendente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Trial': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Cancelada': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  };

  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
};

/**
 * Retorna a cor do nível de log
 * @param {string} level
 * @returns {string} Classes Tailwind
 */
export const getLogLevelColor = (level) => {
  const colors = {
    'info': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'warning': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'error': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'success': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  };

  return colors[level] || colors.info;
};

/**
 * Retorna a cor do plano
 * @param {string} plan
 * @returns {string} Classes Tailwind
 */
export const getPlanColor = (plan) => {
  const colors = {
    'free': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    'starter': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'professional': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'enterprise': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  };

  return colors[plan?.toLowerCase()] || colors.free;
};

/**
 * Retorna informações do plano
 * @param {string} planKey
 * @returns {Object}
 */
export const getPlanInfo = (planKey) => {
  return PLAN_INFO[planKey?.toLowerCase()] || PLAN_INFO.free;
};

/**
 * Calcula porcentagem de mudança
 * @param {number} current
 * @param {number} previous
 * @returns {{ value: number, isPositive: boolean }}
 */
export const calculateChangePercentage = (current, previous) => {
  if (!previous || previous === 0) {
    return { value: 0, isPositive: true };
  }

  const change = ((current - previous) / previous) * 100;

  return {
    value: Math.abs(change),
    isPositive: change >= 0
  };
};

/**
 * Agrupa array por chave
 * @param {Array} array
 * @param {string} key
 * @returns {Object}
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Ordena array por chave
 * @param {Array} array
 * @param {string} key
 * @param {string} direction - 'asc' ou 'desc'
 * @returns {Array}
 */
export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA === valueB) return 0;

    const comparison = valueA > valueB ? 1 : -1;
    return direction === 'asc' ? comparison : -comparison;
  });
};

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Gera ID único
 * @returns {string}
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone de objeto
 * @param {*} obj
 * @returns {*}
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Verifica se objeto está vazio
 * @param {Object} obj
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Capitaliza primeira letra
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Extrai texto de pesquisa (remove acentos, lowercase)
 * @param {string} text
 * @returns {string}
 */
export const normalizeSearchText = (text) => {
  if (!text) return '';

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Verifica se item corresponde à busca
 * @param {Object} item
 * @param {string} searchTerm
 * @param {string[]} searchFields
 * @returns {boolean}
 */
export const matchesSearch = (item, searchTerm, searchFields = ['nome', 'email']) => {
  if (!searchTerm) return true;

  const normalizedSearch = normalizeSearchText(searchTerm);

  return searchFields.some(field => {
    const value = item[field];
    if (!value) return false;

    const normalizedValue = normalizeSearchText(String(value));
    return normalizedValue.includes(normalizedSearch);
  });
};

/**
 * Calcula estatísticas de array
 * @param {number[]} numbers
 * @returns {{ sum: number, avg: number, min: number, max: number }}
 */
export const calculateStats = (numbers) => {
  if (!numbers || numbers.length === 0) {
    return { sum: 0, avg: 0, min: 0, max: 0 };
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const avg = sum / numbers.length;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return { sum, avg, min, max };
};

/**
 * Converte cor HEX para RGB
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number }}
 */
export const hexToRGB = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Verifica contraste de cor (acessibilidade)
 * @param {string} foreground - Cor de frente (HEX)
 * @param {string} background - Cor de fundo (HEX)
 * @returns {{ ratio: number, passesAA: boolean, passesAAA: boolean }}
 */
export const checkColorContrast = (foreground, background) => {
  const getLuminance = (rgb) => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRGB(foreground);
  const bg = hexToRGB(background);

  if (!fg || !bg) return { ratio: 0, passesAA: false, passesAAA: false };

  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7
  };
};
