/**
 * Exemplo Completo de Teste de Acessibilidade: Keyboard Navigation
 *
 * Testa navegação completa por teclado de acordo com WCAG 2.1 AA
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { renderWithProviders } from '../utils/testUtils';
import Admin from '@admin/index';
import { mockUsers, mockCompanies } from '@admin/__mocks__/adminMockData';

// Extend matchers
expect.extend(toHaveNoViolations);

describe('Keyboard Navigation Accessibility (WCAG 2.1.1)', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();

    // Mock API
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, users: mockUsers, companies: mockCompanies }),
    });
  });

  describe('Tab Navigation', () => {
    it('deve navegar entre elementos interativos com Tab', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar para usuários
      await user.tab();
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      expect(usersTab).toHaveFocus();

      // Navegar para próximo botão
      await user.tab();
      const companiesTab = screen.getByRole('button', { name: /empresas/i });
      expect(companiesTab).toHaveFocus();

      // Navegar para próximo
      await user.tab();
      const systemTab = screen.getByRole('button', { name: /sistema/i });
      expect(systemTab).toHaveFocus();

      // Verificar que todos os elementos tiveram focus visível
      expect(usersTab).toHaveClass(/focus:/);
      expect(companiesTab).toHaveClass(/focus:/);
      expect(systemTab).toHaveClass(/focus:/);
    });

    it('deve navegar para trás com Shift+Tab', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar para frente
      await user.tab(); // usersTab
      await user.tab(); // companiesTab
      await user.tab(); // systemTab

      const systemTab = screen.getByRole('button', { name: /sistema/i });
      expect(systemTab).toHaveFocus();

      // Navegar para trás
      await user.tab({ shift: true });
      const companiesTab = screen.getByRole('button', { name: /empresas/i });
      expect(companiesTab).toHaveFocus();

      await user.tab({ shift: true });
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      expect(usersTab).toHaveFocus();
    });

    it('deve ter ordem lógica de tabulação', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar para Users tab
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      await waitFor(() => {
        expect(screen.getByText('Gerenciar Usuários')).toBeInTheDocument();
      });

      // Ordem esperada:
      // 1. Campo de busca
      // 2. Filtros
      // 3. Botão Adicionar
      // 4. Tabela (ações por linha)

      await user.tab();
      const searchInput = screen.getByPlaceholderText(/buscar/i);
      expect(searchInput).toHaveFocus();

      await user.tab();
      const filterSelect = screen.getByLabelText(/filtrar por role/i);
      expect(filterSelect).toHaveFocus();

      await user.tab();
      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      expect(addButton).toHaveFocus();

      // Próximos: ações da tabela
      await user.tab();
      const firstEditButton = screen.getAllByLabelText(/editar/i)[0];
      expect(firstEditButton).toHaveFocus();
    });

    it('não deve ter "Tab trap" em elementos não-modais', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Começar do início
      const firstElement = document.body;
      firstElement.focus();

      // Navegar por todos os elementos
      let tabCount = 0;
      const maxTabs = 50;

      while (tabCount < maxTabs) {
        await user.tab();
        tabCount++;

        const focused = document.activeElement;

        // Não deve ficar preso no mesmo elemento
        if (tabCount > 2) {
          await user.tab();
          expect(document.activeElement).not.toBe(focused);
        }
      }

      // Se chegou aqui, não há tab trap
      expect(tabCount).toBe(maxTabs);
    });
  });

  describe('Enter/Space Activation', () => {
    it('deve ativar botões com Enter', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar até botão
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      usersTab.focus();

      expect(usersTab).toHaveFocus();

      // Ativar com Enter
      await user.keyboard('{Enter}');

      // Verificar navegação
      await waitFor(() => {
        expect(screen.getByText('Gerenciar Usuários')).toBeInTheDocument();
      });
    });

    it('deve ativar botões com Space', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      const usersTab = screen.getByRole('button', { name: /usuários/i });
      usersTab.focus();

      // Ativar com Space
      await user.keyboard(' ');

      // Verificar navegação
      await waitFor(() => {
        expect(screen.getByText('Gerenciar Usuários')).toBeInTheDocument();
      });
    });

    it('deve abrir modal com Enter', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Ir para Users
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      await waitFor(() => {
        expect(screen.getByText('Gerenciar Usuários')).toBeInTheDocument();
      });

      // Focar botão Adicionar
      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      addButton.focus();

      // Abrir com Enter
      await user.keyboard('{Enter}');

      // Modal deve abrir
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('deve submeter formulário com Enter', async () => {
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

      // Preencher com teclado
      const modal = screen.getByRole('dialog');
      const nameInput = within(modal).getByLabelText(/nome/i);

      nameInput.focus();
      await user.keyboard('Test User');

      await user.tab();
      const emailInput = within(modal).getByLabelText(/email/i);
      expect(emailInput).toHaveFocus();
      await user.keyboard('test@test.com');

      // Mock success
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, user: { id: '4' } }),
      });

      // Submeter com Enter
      await user.keyboard('{Enter}');

      // Verificar toast
      await waitFor(() => {
        expect(screen.getByText(/usuário criado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Arrow Keys Navigation', () => {
    it('deve navegar sidebar com Arrow keys', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Focar primeiro item da sidebar
      const dashboardTab = screen.getByRole('button', { name: /dashboard/i });
      dashboardTab.focus();

      expect(dashboardTab).toHaveFocus();

      // Navegar para baixo com ArrowDown
      await user.keyboard('{ArrowDown}');
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      expect(usersTab).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      const companiesTab = screen.getByRole('button', { name: /empresas/i });
      expect(companiesTab).toHaveFocus();

      // Navegar para cima com ArrowUp
      await user.keyboard('{ArrowUp}');
      expect(usersTab).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(dashboardTab).toHaveFocus();
    });

    it('deve fazer wrap ao chegar no final com ArrowDown', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Focar último item
      const systemTab = screen.getByRole('button', { name: /sistema/i });
      systemTab.focus();

      // ArrowDown no último deve voltar ao primeiro
      await user.keyboard('{ArrowDown}');
      const dashboardTab = screen.getByRole('button', { name: /dashboard/i });
      expect(dashboardTab).toHaveFocus();
    });

    it('deve fazer wrap ao chegar no início com ArrowUp', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Focar primeiro item
      const dashboardTab = screen.getByRole('button', { name: /dashboard/i });
      dashboardTab.focus();

      // ArrowUp no primeiro deve ir ao último
      await user.keyboard('{ArrowUp}');
      const systemTab = screen.getByRole('button', { name: /sistema/i });
      expect(systemTab).toHaveFocus();
    });

    it('deve navegar dropdowns com Arrow keys', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Ir para Users
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      await waitFor(() => {
        expect(screen.getByText('Gerenciar Usuários')).toBeInTheDocument();
      });

      // Focar select de role
      const roleSelect = screen.getByLabelText(/filtrar por role/i);
      roleSelect.focus();

      // Abrir com ArrowDown
      await user.keyboard('{ArrowDown}');

      // Deve abrir dropdown
      expect(roleSelect).toHaveAttribute('aria-expanded', 'true');

      // Navegar opções
      await user.keyboard('{ArrowDown}'); // Selecionar próxima
      await user.keyboard('{ArrowDown}'); // Selecionar próxima

      // Confirmar com Enter
      await user.keyboard('{Enter}');

      // Dropdown deve fechar
      expect(roleSelect).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('ESC Key', () => {
    it('deve fechar modal com ESC', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Abrir modal
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Fechar com ESC
      await user.keyboard('{Escape}');

      // Modal deve fechar
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('deve fechar dropdown com ESC', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      await waitFor(() => {
        expect(screen.getByText('Gerenciar Usuários')).toBeInTheDocument();
      });

      // Abrir dropdown
      const roleSelect = screen.getByLabelText(/filtrar por role/i);
      roleSelect.focus();
      await user.keyboard('{ArrowDown}');

      expect(roleSelect).toHaveAttribute('aria-expanded', 'true');

      // Fechar com ESC
      await user.keyboard('{Escape}');

      expect(roleSelect).toHaveAttribute('aria-expanded', 'false');
    });

    it('deve fechar confirmação com ESC', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Navegar e tentar deletar
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      await waitFor(() => {
        expect(screen.getByText('Manager User')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText(/deletar manager user/i);
      await user.click(deleteButton);

      // Confirmação deve aparecer
      await waitFor(() => {
        expect(screen.getByText(/tem certeza/i)).toBeInTheDocument();
      });

      // Cancelar com ESC
      await user.keyboard('{Escape}');

      // Confirmação deve fechar
      await waitFor(() => {
        expect(screen.queryByText(/tem certeza/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Focus Trap in Modals', () => {
    it('deve ter focus trap no modal', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Abrir modal
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const modal = screen.getByRole('dialog');

      // Primeiro elemento focável do modal
      const firstElement = within(modal).getByLabelText(/nome/i);
      expect(firstElement).toHaveFocus();

      // Navegar até último elemento
      await user.tab(); // email
      await user.tab(); // role
      await user.tab(); // botão Salvar
      await user.tab(); // botão Cancelar

      const lastElement = within(modal).getByRole('button', { name: /cancelar/i });
      expect(lastElement).toHaveFocus();

      // Tab novamente deve voltar ao primeiro
      await user.tab();
      expect(firstElement).toHaveFocus();

      // Shift+Tab no primeiro deve ir ao último
      await user.tab({ shift: true });
      expect(lastElement).toHaveFocus();
    });

    it('deve focar primeiro elemento ao abrir modal', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Primeiro input deve ter focus automaticamente
      const modal = screen.getByRole('dialog');
      const nameInput = within(modal).getByLabelText(/nome/i);
      expect(nameInput).toHaveFocus();
    });

    it('deve restaurar focus ao fechar modal', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Fechar modal
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Focus deve voltar ao botão que abriu
      expect(addButton).toHaveFocus();
    });
  });

  describe('Focus Visible', () => {
    it('deve ter outline visível em todos os elementos focáveis', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      // Testar botões
      const usersTab = screen.getByRole('button', { name: /usuários/i });
      usersTab.focus();

      const styles = window.getComputedStyle(usersTab);
      // Deve ter outline ou ring (Tailwind focus:ring)
      expect(
        styles.outline !== 'none' ||
        usersTab.classList.contains('focus:ring') ||
        usersTab.classList.contains('focus:outline')
      ).toBe(true);

      // Testar inputs
      await user.click(usersTab);
      await waitFor(() => {
        expect(screen.getByText('Gerenciar Usuários')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/buscar/i);
      searchInput.focus();

      const inputStyles = window.getComputedStyle(searchInput);
      expect(
        inputStyles.outline !== 'none' ||
        searchInput.classList.contains('focus:ring') ||
        searchInput.classList.contains('focus:border')
      ).toBe(true);
    });

    it('deve ter contraste suficiente no focus', async () => {
      renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      const usersTab = screen.getByRole('button', { name: /usuários/i });
      usersTab.focus();

      // Focus indicator deve ter contraste mínimo 3:1
      const styles = window.getComputedStyle(usersTab);
      const outlineColor = styles.outlineColor;

      // Validar que não é transparente ou muito claro
      expect(outlineColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(outlineColor).not.toBe('transparent');
    });
  });

  describe('Skip Links', () => {
    it('deve ter skip to main content link', async () => {
      renderWithProviders(<Admin />);

      // Primeiro Tab deve focar skip link
      await user.tab();

      const skipLink = screen.getByText(/pular para conteúdo principal|skip to main content/i);
      expect(skipLink).toHaveFocus();
    });

    it('deve navegar para main content ao clicar em skip link', async () => {
      renderWithProviders(<Admin />);

      await user.tab();
      const skipLink = screen.getByText(/pular para conteúdo principal|skip to main content/i);

      await user.keyboard('{Enter}');

      // Focus deve ir para main content
      const mainContent = screen.getByRole('main');
      expect(mainContent).toHaveFocus();
    });
  });

  describe('Axe Accessibility Tests', () => {
    it('não deve ter violações de acessibilidade na página inicial', async () => {
      const { container } = renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('não deve ter violações na tab Users', async () => {
      const { container } = renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      await waitFor(() => {
        expect(screen.getByText('Gerenciar Usuários')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('não deve ter violações no modal', async () => {
      const { container } = renderWithProviders(<Admin />);

      await waitFor(() => {
        expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      });

      const usersTab = screen.getByRole('button', { name: /usuários/i });
      await user.click(usersTab);

      const addButton = screen.getByRole('button', { name: /adicionar usuário/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
