// Custom render function with providers
import React from 'react';
import { render } from '@testing-library/react';
import { AppProvider } from '../../contexts/AppContext';

// Mock AppContext para testes
  savingStatus: null,
  lastSaved: null,
  updateSavingStatus: jest.fn(),
};

// Custom render com providers
export function renderWithProviders(ui, options = {}) {
  const {
    contextValue = mockContextValue,
    ...renderOptions
  } = options;

  function Wrapper({ children }) {
    return (
      <AppProvider value={contextValue}>
        {children}
      </AppProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    mockContextValue,
  };
}

// Re-export tudo do testing-library
export * from '@testing-library/react';
export { renderWithProviders as render };
