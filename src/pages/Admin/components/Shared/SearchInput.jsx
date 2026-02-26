import React, { useCallback } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { debounce } from '../../utils/adminHelpers';

/**
 * Input de Busca Reutilizável
 * Com debounce automático e clear button
 *
 * @param {Object} props
 * @param {string} props.value - Valor atual
 * @param {Function} props.onChange - Callback de mudança
 * @param {string} props.placeholder - Placeholder
 * @param {number} props.debounceMs - Delay do debounce (padrão: 300ms)
 * @param {string} props.className - Classes adicionais
 * @returns {JSX.Element}
 */
export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  debounceMs = 300,
  className = ''
}) => {
  // Debounced onChange
  const debouncedOnChange = useCallback(
    debounce((newValue) => {
      onChange(newValue);
    }, debounceMs),
    [onChange, debounceMs]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Ícone de busca */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Input */}
      <input
        type="text"
        defaultValue={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:ring-2 focus:ring-purple-500 focus:border-transparent
                   transition-colors"
      />

      {/* Botão limpar */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center
                     text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                     transition-colors"
          aria-label="Limpar busca"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default React.memo(SearchInput);
