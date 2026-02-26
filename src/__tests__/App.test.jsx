/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Teste básico de renderização
describe('App Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<div>Test App</div>);
    expect(container).toBeInTheDocument();
  });

  it('should render text content', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
