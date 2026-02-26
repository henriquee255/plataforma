import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FaSearch, FaTimes } from 'react-icons/fa';

/**
 * SearchBar - Barra de busca com debounce
 */
const SearchBar = ({
  placeholder = 'Buscar...',
  onSearch,
  debounceMs = 300,
  className = '',
}) => {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setValue('');
    setDebouncedValue('');
  };

  return (
    <div className={`relative ${className}`}>
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 pr-10"
        aria-label="Buscar"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Limpar busca"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
