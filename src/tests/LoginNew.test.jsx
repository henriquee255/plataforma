import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginNew from '../pages/LoginNew';
import { AuthProvider } from '../contexts/AuthContext';

// Mock dos services
vi.mock('../services/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshTokens: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('../utils/tokenStorage', () => ({
  getAccessToken: vi.fn(() => null),
  getRefreshToken: vi.fn(() => null),
  getUser: vi.fn(() => null),
  saveAuthData: vi.fn(),
  clearAuthData: vi.fn(),
  isTokenExpired: vi.fn(() => false),
  willTokenExpireSoon: vi.fn(() => false),
  decodeToken: vi.fn(() => null),
}));

import * as authService from '../services/authService';

describe('LoginNew Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (component) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('deve renderizar o formulário de login corretamente', () => {
    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve renderizar o branding na esquerda', () => {
    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    // O branding pode estar oculto em telas pequenas (hidden lg:flex)
    // Verificar se existe na árvore DOM mesmo que não visível
    const branding = document.querySelector('.lg\\:flex');
    expect(branding).toBeTruthy();

    // Verificar textos específicos do branding
    expect(document.body.textContent).toContain('Plataforma CRM');
    expect(document.body.textContent).toContain('Transforme seus');
  });

  it('deve renderizar os cards de features', () => {
    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    expect(screen.getByText('Dashboard em Tempo Real')).toBeInTheDocument();
    expect(screen.getByText('Gestão de Equipes')).toBeInTheDocument();
    expect(screen.getByText('100% Seguro')).toBeInTheDocument();
  });

  it('deve renderizar o checkbox "Manter conectado"', () => {
    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    const checkbox = screen.getByRole('checkbox', { name: /manter conectado/i });
    expect(checkbox).toBeInTheDocument();
  });

  it('deve renderizar o link para registro', () => {
    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    expect(screen.getByText(/Criar uma conta gratuita/i)).toBeInTheDocument();
  });

  it('deve validar email obrigatório ao submeter', async () => {
    const user = userEvent.setup();
    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('deve validar formato de email inválido', async () => {
    const user = userEvent.setup();
    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.clear(emailInput);
    await user.type(emailInput, 'email-invalido');
    await user.clear(passwordInput);
    await user.type(passwordInput, 'senha123');

    await user.click(submitButton);

    // Aguardar um momento para a validação processar
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verificar que o serviço de login NÃO foi chamado (validação impediu)
    expect(authService.login).not.toHaveBeenCalled();

    // Verificar se há erro no documento (texto exato pode variar)
    const bodyText = document.body.textContent;
    expect(bodyText).toMatch(/inválido/i);
  });

  it('deve validar senha obrigatória ao submeter', async () => {
    const user = userEvent.setup();
    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'teste@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('deve chamar login com credenciais corretas', async () => {
    const user = userEvent.setup();

      success: true,
      user: { id: '1', name: 'Test', email: 'test@example.com', role: 'user' },
      accessToken: 'token',
      refreshToken: 'refresh',
    };

    authService.login.mockResolvedValueOnce(mockResponse);

    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'teste@example.com');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'teste@example.com',
        password: 'senha123',
      });
    });
  });

  it('deve mostrar erro de autenticação quando login falhar', async () => {
    const user = userEvent.setup();

    authService.login.mockRejectedValueOnce(new Error('Email ou senha inválidos'));

    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'teste@example.com');
    await user.type(passwordInput, 'senha-errada');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email ou senha inválidos/i)).toBeInTheDocument();
    });
  });

  it('deve navegar para dashboard após login bem-sucedido', async () => {
    const user = userEvent.setup();

      success: true,
      user: { id: '1', name: 'Test', email: 'test@example.com', role: 'user' },
      accessToken: 'token',
      refreshToken: 'refresh',
    };

    authService.login.mockResolvedValueOnce(mockResponse);

    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'teste@example.com');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('dashboard');
    });
  });

  it('deve navegar para registro ao clicar no link', async () => {
    const user = userEvent.setup();
    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    const registerLink = screen.getByText(/Criar uma conta gratuita/i);
    await user.click(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('register');
  });

  it('deve mostrar loading durante o login', async () => {
    const user = userEvent.setup();

    // Mock que demora para resolver
    authService.login.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({
        success: true,
        user: { id: '1', name: 'Test', email: 'test@example.com', role: 'user' },
        accessToken: 'token',
        refreshToken: 'refresh',
      }), 100))
    );

    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'teste@example.com');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    // Verificar se está mostrando loading
    expect(screen.getByText(/entrando/i)).toBeInTheDocument();
  });

  it('deve limpar erro ao clicar no botão de fechar do ErrorAlert', async () => {
    const user = userEvent.setup();

    authService.login.mockRejectedValueOnce(new Error('Erro de teste'));

    renderWithAuth(<LoginNew onNavigate={mockNavigate} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'teste@example.com');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    // Esperar erro aparecer
    await waitFor(() => {
      expect(screen.getByText(/Erro de teste/i)).toBeInTheDocument();
    });

    // Clicar no botão de fechar (aria-label="Fechar alerta")
    const closeButton = screen.getByRole('button', { name: /fechar alerta/i });
    await user.click(closeButton);

    // Erro deve desaparecer
    await waitFor(() => {
      expect(screen.queryByText(/Erro de teste/i)).not.toBeInTheDocument();
    });
  });
});
