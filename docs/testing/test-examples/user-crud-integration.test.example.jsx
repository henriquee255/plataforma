/**
 * Exemplo Completo de Teste de Integração: User CRUD Flow
 *
 * Testa o fluxo completo de criação, edição e deleção de usuário
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/testUtils';
import Admin from '@admin/index';
import { mockUsers } from '@admin/__mocks__/adminMockData';

describe('User CRUD Integration', () => {
  let mockFetch;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    mockFetch = vi.fn();
    global.fetch = mockFetch;

    // Mock inicial: listar usuários
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, users: mockUsers }),
    });
  });

  describe('Fluxo Completo: Criar → Editar → Deletar', () => {
    it('deve completar fluxo de gerenciamento de usuário', async () => {
      // ===== SETUP =====
      renderWithProviders(<Admin />);

      // Aguardar carregamento inicial
      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // ===== 1. NAVEGAR PARA TAB USUÁRIOS =====
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      await waitFor(() => {
        expect(screen.getByText('Gerenciar Usuários')).toBeInTheDocument();
      });

      // Verificar usuários existentes na tabela
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Manager User')).toBeInTheDocument();
      expect(screen.getByText('Regular User')).toBeInTheDocument();

      // ===== 2. ABRIR MODAL DE CRIAÇÃO =====
      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      await user.click(addButton);

      // Aguardar modal abrir
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Criar Novo Usuário')).toBeInTheDocument();
      });

      // ===== 3. PREENCHER FORMULÁRIO =====
      const modal = screen.getByRole('dialog');

      const nameInput = within(modal).getByLabelText(/nome/i);
      const emailInput = within(modal).getByLabelText(/email/i);
      const roleSelect = within(modal).getByLabelText(/permissão|role/i);

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.selectOptions(roleSelect, 'user');

      // Verificar campos preenchidos
      expect(nameInput).toHaveValue('Test User');
      expect(emailInput).toHaveValue('test@example.com');
      expect(roleSelect).toHaveValue('user');

      // ===== 4. SUBMETER CRIAÇÃO =====
      const newUser = {
        id: '4',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        status: 'ativo',
        createdAt: new Date().toISOString(),
      };

      // Mock create success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, user: newUser }),
      });

      // Mock lista atualizada
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          users: [...mockUsers, newUser],
        }),
      });

      const saveButton = within(modal).getByRole('button', { name: /salvar|criar/i });
      await user.click(saveButton);

      // ===== 5. VERIFICAR TOAST DE SUCESSO =====
      await waitFor(() => {
        expect(screen.getByText(/usuário criado com sucesso/i)).toBeInTheDocument();
      });

      // Modal deve ter fechado
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // ===== 6. VERIFICAR USUÁRIO NA TABELA =====
      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });

      // Verificar badge de role
      const userRow = screen.getByText('Test User').closest('tr');
      expect(within(userRow).getByText('User')).toBeInTheDocument();

      // Verificar badge de status
      expect(within(userRow).getByText('Ativo')).toBeInTheDocument();

      // ===== 7. ABRIR MODAL DE EDIÇÃO =====
      const editButton = within(userRow).getByLabelText(/editar test user/i);
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Editar Usuário')).toBeInTheDocument();
      });

      // ===== 8. ALTERAR DADOS =====
      const editModal = screen.getByRole('dialog');
      const editNameInput = within(editModal).getByLabelText(/nome/i);

      // Limpar e digitar novo nome
      await user.clear(editNameInput);
      await user.type(editNameInput, 'Test User Updated');

      expect(editNameInput).toHaveValue('Test User Updated');

      // ===== 9. SUBMETER EDIÇÃO =====
      const updatedUser = {
        ...newUser,
        name: 'Test User Updated',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, user: updatedUser }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          users: [...mockUsers, updatedUser],
        }),
      });

      const updateButton = within(editModal).getByRole('button', { name: /salvar|atualizar/i });
      await user.click(updateButton);

      // ===== 10. VERIFICAR TOAST DE ATUALIZAÇÃO =====
      await waitFor(() => {
        expect(screen.getByText(/usuário atualizado com sucesso/i)).toBeInTheDocument();
      });

      // ===== 11. VERIFICAR DADOS ATUALIZADOS =====
      await waitFor(() => {
        expect(screen.getByText('Test User Updated')).toBeInTheDocument();
      });

      // Nome antigo não deve mais existir
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();

      // ===== 12. DELETAR USUÁRIO =====
      const updatedRow = screen.getByText('Test User Updated').closest('tr');
      const deleteButton = within(updatedRow).getByLabelText(/deletar test user updated/i);

      await user.click(deleteButton);

      // ===== 13. CONFIRMAR DELEÇÃO =====
      await waitFor(() => {
        expect(screen.getByText(/tem certeza que deseja deletar/i)).toBeInTheDocument();
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'User deleted' }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, users: mockUsers }),
      });

      const confirmButton = screen.getByRole('button', { name: /confirmar|deletar/i });
      await user.click(confirmButton);

      // ===== 14. VERIFICAR TOAST DE DELEÇÃO =====
      await waitFor(() => {
        expect(screen.getByText(/usuário deletado com sucesso/i)).toBeInTheDocument();
      });

      // ===== 15. VERIFICAR USUÁRIO REMOVIDO =====
      await waitFor(() => {
        expect(screen.queryByText('Test User Updated')).not.toBeInTheDocument();
      });

      // Usuários originais devem permanecer
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Manager User')).toBeInTheDocument();
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });
  });

  describe('Atualizar Role via Dropdown', () => {
    it('deve atualizar role de usuário diretamente na tabela', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar para usuários
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      // Encontrar linha do usuário
      await waitFor(() => {
        expect(screen.getByText('Regular User')).toBeInTheDocument();
      });

      const userRow = screen.getByText('Regular User').closest('tr');
      const roleSelect = within(userRow).getByLabelText(/role|permissão/i);

      // Verificar role atual
      expect(roleSelect).toHaveValue('user');

      // Mock update role
      const updatedUser = {
        ...mockUsers[2],
        role: 'manager',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, user: updatedUser }),
      });

      // Mudar role
      await user.selectOptions(roleSelect, 'manager');

      // Verificar toast
      await waitFor(() => {
        expect(screen.getByText(/role atualizada com sucesso/i)).toBeInTheDocument();
      });

      // Verificar badge atualizado
      await waitFor(() => {
        expect(within(userRow).getByText('Manager')).toBeInTheDocument();
      });
    });
  });

  describe('Atualizar Status', () => {
    it('deve ativar/desativar usuário', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar para usuários
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      // Encontrar usuário inativo
      await waitFor(() => {
        expect(screen.getByText('Regular User')).toBeInTheDocument();
      });

      const userRow = screen.getByText('Regular User').closest('tr');

      // Verificar status atual (inativo)
      expect(within(userRow).getByText('Inativo')).toBeInTheDocument();

      // Clicar em botão de ativar
      const activateButton = within(userRow).getByLabelText(/ativar/i);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: { ...mockUsers[2], status: 'ativo' },
        }),
      });

      await user.click(activateButton);

      // Verificar toast
      await waitFor(() => {
        expect(screen.getByText(/usuário ativado com sucesso/i)).toBeInTheDocument();
      });

      // Verificar badge atualizado
      await waitFor(() => {
        expect(within(userRow).getByText('Ativo')).toBeInTheDocument();
      });
    });
  });

  describe('Validações no Formulário', () => {
    it('deve mostrar erro ao submeter formulário vazio', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar e abrir modal
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Tentar submeter sem preencher
      const modal = screen.getByRole('dialog');
      const saveButton = within(modal).getByRole('button', { name: /salvar|criar/i });
      await user.click(saveButton);

      // Verificar mensagens de erro
      await waitFor(() => {
        expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
        expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      });

      // Modal deve permanecer aberto
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('deve mostrar erro ao usar email inválido', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar e abrir modal
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Preencher com email inválido
      const modal = screen.getByRole('dialog');
      const nameInput = within(modal).getByLabelText(/nome/i);
      const emailInput = within(modal).getByLabelText(/email/i);

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'invalid-email');

      const saveButton = within(modal).getByRole('button', { name: /salvar|criar/i });
      await user.click(saveButton);

      // Verificar erro
      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      });
    });

    it('deve mostrar erro ao usar email já cadastrado', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar e abrir modal
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Preencher com email existente
      const modal = screen.getByRole('dialog');
      const nameInput = within(modal).getByLabelText(/nome/i);
      const emailInput = within(modal).getByLabelText(/email/i);

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'admin@test.com'); // Email já existe

      // Mock erro 409
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ success: false, error: 'Email já cadastrado' }),
      });

      const saveButton = within(modal).getByRole('button', { name: /salvar|criar/i });
      await user.click(saveButton);

      // Verificar toast de erro
      await waitFor(() => {
        expect(screen.getByText(/email já cadastrado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Proteções de Segurança', () => {
    it('deve impedir deleção do próprio usuário', async () => {
      // Mock current user como Admin User
      renderWithProviders(<Admin />, {
        authContextValue: {
          user: { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'superadmin' },
        },
      });

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar para usuários
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument();
      });

      // Tentar deletar próprio usuário
      const userRow = screen.getByText('Admin User').closest('tr');
      const deleteButton = within(userRow).queryByLabelText(/deletar admin user/i);

      // Botão não deve existir ou estar desabilitado
      expect(deleteButton).toBeNull();
    });

    it('deve impedir deleção do último superadmin', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar para usuários
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument();
      });

      // Tentar deletar único superadmin
      const userRow = screen.getByText('Admin User').closest('tr');
      const deleteButton = within(userRow).getByLabelText(/deletar admin user/i);

      // Mock erro de validação
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: 'Não é possível deletar o último superadmin',
        }),
      });

      await user.click(deleteButton);

      // Confirmar
      const confirmButton = screen.getByRole('button', { name: /confirmar|deletar/i });
      await user.click(confirmButton);

      // Verificar erro
      await waitFor(() => {
        expect(
          screen.getByText(/não é possível deletar o último superadmin/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Feedback de Loading', () => {
    it('deve mostrar loading durante criação', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar e abrir modal
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Preencher formulário
      const modal = screen.getByRole('dialog');
      await user.type(within(modal).getByLabelText(/nome/i), 'Test User');
      await user.type(within(modal).getByLabelText(/email/i), 'test@test.com');

      // Mock resposta lenta
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, user: { id: '4' } }),
                }),
              1000
            )
          )
      );

      const saveButton = within(modal).getByRole('button', { name: /salvar|criar/i });
      await user.click(saveButton);

      // Verificar loading
      await waitFor(() => {
        expect(screen.getByText(/salvando|criando/i)).toBeInTheDocument();
      });

      // Botão deve estar desabilitado
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Persistência de Dados', () => {
    it('deve manter dados ao navegar entre tabs', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Criar usuário na tab Users
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      // ... criar usuário ...

      // Navegar para Dashboard
      const dashboardTab = screen.getByRole('button', { name: /dashboard/i });
      await user.click(dashboardTab);

      // Voltar para Users
      await user.click(usersTab);

      // Usuário criado deve ainda estar lá
      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
      });
    });
  });
});
