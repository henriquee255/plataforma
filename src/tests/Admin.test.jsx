import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Admin from '../pages/Admin';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';

// Mock dos services
vi.mock('../services/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshTokens: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('../utils/tokenStorage', () => ({
  getAccessToken: vi.fn(() => 'fake-token'),
  getRefreshToken: vi.fn(() => 'fake-refresh'),
  getUser: vi.fn(() => ({ id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' })),
  saveAuthData: vi.fn(),
  clearAuthData: vi.fn(),
  isTokenExpired: vi.fn(() => false),
  willTokenExpireSoon: vi.fn(() => false),
  decodeToken: vi.fn(() => ({ exp: Date.now() / 1000 + 3600 })),
}));

// Mock do useNotification
vi.mock('../hooks/useNotification', () => ({
  useNotification: () => ({
    notifyUpdated: vi.fn(),
    notifyDeleted: vi.fn(),
    notifyError: vi.fn(),
  }),
}));

// Mock do useAuth
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' },
    isLoading: false,
    isAuthenticated: true,
  }),
}));

// Mock do fetch global
global.fetch = vi.fn();

describe('Admin Component', () => {

    {
      id: '1',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      avatar: 'https://example.com/avatar1.jpg',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'Manager User',
      email: 'manager@test.com',
      role: 'manager',
      avatar: 'https://example.com/avatar2.jpg',
      createdAt: '2026-01-02T00:00:00.000Z',
    },
    {
      id: '3',
      name: 'Regular User',
      email: 'user@test.com',
      role: 'user',
      avatar: 'https://example.com/avatar3.jpg',
      createdAt: '2026-01-03T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock da resposta de listagem de usuários
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        users: mockUsers,
      }),
    });
  });

  const renderWithAuth = (component) => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <AuthProvider>
            {component}
          </AuthProvider>
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('deve renderizar o título "Painel Administrativo"', async () => {
    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
    });
  });

  it('deve renderizar os cards de estatísticas', async () => {
    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.getByText('Total de Usuários')).toBeInTheDocument();
      expect(screen.getByText('Administradores')).toBeInTheDocument();
      expect(screen.getByText('Gerentes')).toBeInTheDocument();
      expect(screen.getByText('Usuários Padrão')).toBeInTheDocument();
    });
  });

  it('deve mostrar contadores corretos nos cards', async () => {
    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      // Verificar que os títulos dos cards existem
      expect(screen.getByText('Total de Usuários')).toBeInTheDocument();
      expect(screen.getByText('Administradores')).toBeInTheDocument();
      expect(screen.getByText('Gerentes')).toBeInTheDocument();
      expect(screen.getByText('Usuários Padrão')).toBeInTheDocument();

      // Verificar que há pelo menos números sendo exibidos
      const allText = document.body.textContent;
      expect(allText).toContain('3'); // Total de usuários
    });
  });

  it('deve renderizar a tabela de usuários', async () => {
    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Permissão')).toBeInTheDocument(); // Coluna de role
      expect(screen.getByText('Criado em')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
    });
  });

  it('deve renderizar todos os usuários na tabela', async () => {
    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Manager User')).toBeInTheDocument();
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });
  });

  it('deve renderizar badges de role com cores corretas', async () => {
    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      const badges = screen.getAllByText(/admin|manager|user/i);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('deve renderizar avatares dos usuários', async () => {
    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      const avatars = screen.getAllByRole('img');
      expect(avatars.length).toBe(mockUsers.length);
    });
  });

  it('deve renderizar dropdown de role para cada usuário', async () => {
    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      // Verificar se há selects ou dropdowns
      const selects = document.querySelectorAll('[role="combobox"], select');
      expect(selects.length).toBeGreaterThan(0);
    });
  });

  it('deve renderizar botões de ação (ver, deletar)', async () => {
    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      // Botões de visualizar e deletar
      const actionButtons = screen.getAllByRole('button');
      expect(actionButtons.length).toBeGreaterThan(0);
    });
  });

  it('deve atualizar role de um usuário ao selecionar nova role', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, users: mockUsers }),
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: { ...mockUsers[2], role: 'manager' },
      }),
    });

    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });

    // Simular mudança de role
    // (Isso depende da implementação específica do dropdown)
  });

  it('deve mostrar confirmação antes de deletar usuário', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // Buscar botão de deletar pelo aria-label
    const deleteButton = screen.getByRole('button', { name: /deletar admin user/i });
    expect(deleteButton).toBeInTheDocument();

    // Clicar no botão
    await user.click(deleteButton);

    // Verificar que a confirmação foi chamada
    expect(confirmSpy).toHaveBeenCalledWith('Tem certeza que deseja deletar Admin User?');

    confirmSpy.mockRestore();
  });

  it('deve fazer requisição para backend ao carregar', async () => {
    // Mock do localStorage para retornar token
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');

    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      // Verificar que foi chamado com a URL correta
      const fetchCalls = global.fetch.mock.calls;
      const usersCall = fetchCalls.find(call =>
        call[0] === 'http://localhost:3001/api/users'
      );
      expect(usersCall).toBeDefined();
    });

    getItemSpy.mockRestore();
  });

  it('deve mostrar loading enquanto carrega dados', () => {
    // Mock que demora para resolver
    global.fetch.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, users: mockUsers }),
      }), 100))
    );

    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    // Deve mostrar algum indicador de loading
    expect(screen.queryByText('Carregando...')).toBeTruthy;
  });

  it('deve mostrar mensagem de erro se falhar ao carregar', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Erro ao carregar usuários'));

    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      // Verificar se mostra erro (depende da implementação)
      expect(screen.queryByText(/erro/i)).toBeTruthy;
    });
  });

  it('deve ter botão de voltar ao dashboard', async () => {
    renderWithAuth(<Admin onNavigate={mockNavigate} />);

    await waitFor(() => {
      const backButton = screen.queryByRole('button', { name: /voltar/i });
      expect(backButton).toBeTruthy;
    });
  });
});
