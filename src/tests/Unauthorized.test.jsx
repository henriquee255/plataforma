import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Unauthorized from '../pages/Unauthorized';

describe('Unauthorized Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a mensagem de acesso negado', () => {
    render(<Unauthorized onNavigate={mockNavigate} />);

    expect(screen.getByText('Acesso Negado')).toBeInTheDocument();
  });

  it('deve renderizar o ícone de escudo', () => {
    render(<Unauthorized onNavigate={mockNavigate} />);

    // Verificar se há um elemento com a classe do ícone
    const shield = document.querySelector('svg');
    expect(shield).toBeInTheDocument();
  });

  it('deve renderizar a descrição do erro', () => {
    render(<Unauthorized onNavigate={mockNavigate} />);

    expect(screen.getByText(/Você não tem permissão para acessar esta página/i)).toBeInTheDocument();
  });

  it('deve renderizar o botão voltar ao dashboard', () => {
    render(<Unauthorized onNavigate={mockNavigate} />);

    expect(screen.getByRole('button', { name: /voltar ao dashboard/i })).toBeInTheDocument();
  });

  it('deve renderizar o botão voltar à página anterior', () => {
    render(<Unauthorized onNavigate={mockNavigate} />);

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeInTheDocument();
  });

  it('deve navegar para dashboard ao clicar em "Voltar ao Dashboard"', async () => {
    const user = userEvent.setup();
    render(<Unauthorized onNavigate={mockNavigate} />);

    const dashboardButton = screen.getByRole('button', { name: /voltar ao dashboard/i });
    await user.click(dashboardButton);

    expect(mockNavigate).toHaveBeenCalledWith('dashboard');
  });

  it('deve chamar history.back ao clicar em "Página Anterior"', async () => {
    const user = userEvent.setup();
    window.history.back = mockBack;

    render(<Unauthorized onNavigate={mockNavigate} />);

    const backButton = screen.getByRole('button', { name: /página anterior/i });
    await user.click(backButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it('deve ter o código de status 403 visível', () => {
    render(<Unauthorized onNavigate={mockNavigate} />);

    expect(screen.getByText(/403/i)).toBeInTheDocument();
  });

  it('deve aplicar classes de estilo purple gradient', () => {
    const { container } = render(<Unauthorized onNavigate={mockNavigate} />);

    // Verificar se há elementos com classes gradient purple
    const gradientElements = container.querySelectorAll('[class*="purple"]');
    expect(gradientElements.length).toBeGreaterThan(0);
  });

  it('deve renderizar em dark mode corretamente', () => {
    const { container } = render(<Unauthorized onNavigate={mockNavigate} />);

    // Verificar se há classes dark:
    const darkElements = container.querySelectorAll('[class*="dark:"]');
    expect(darkElements.length).toBeGreaterThan(0);
  });
});
