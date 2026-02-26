import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AdminAnalytics from '../pages/AdminAnalytics';

// Mock dos hooks
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Admin User', role: 'admin' },
  }),
}));

vi.mock('../hooks/useNotification.jsx', () => ({
  useNotification: () => ({
    notifyError: vi.fn(),
    notifySuccess: vi.fn(),
  }),
}));

// Mock do Recharts para evitar erros de canvas
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  Cell: () => null,
}));

describe('AdminAnalytics', () => {
  const mockOnNavigate = vi.fn();

  it('deve renderizar o componente AdminAnalytics após o carregamento', async () => {
    render(<AdminAnalytics onNavigate={mockOnNavigate} />);

    // Aguardar o carregamento (1 segundo no componente)
    await waitFor(
      () => {
        expect(screen.getByText('Analytics & Insights')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('deve exibir todos os KPIs principais', async () => {
    render(<AdminAnalytics onNavigate={mockOnNavigate} />);

    await waitFor(
      () => {
        expect(screen.getByText('MRR')).toBeInTheDocument();
        expect(screen.getByText('ARR')).toBeInTheDocument();
        expect(screen.getByText('Usuários Ativos')).toBeInTheDocument();
        expect(screen.getByText('Taxa de Conversão')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('deve exibir seções de gráficos', async () => {
    render(<AdminAnalytics onNavigate={mockOnNavigate} />);

    await waitFor(
      () => {
        expect(screen.getByText('Crescimento de Usuários')).toBeInTheDocument();
        expect(screen.getByText('Crescimento de Receita')).toBeInTheDocument();
        expect(screen.getByText('Distribuição de Planos')).toBeInTheDocument();
        expect(screen.getByText('Integrações Mais Usadas')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('deve exibir métricas de engajamento', async () => {
    render(<AdminAnalytics onNavigate={mockOnNavigate} />);

    await waitFor(
      () => {
        expect(screen.getByText('Tempo Médio de Sessão')).toBeInTheDocument();
        expect(screen.getByText('Features Utilizadas')).toBeInTheDocument();
        expect(screen.getByText('Taxa de Atividade')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('deve ter botão de atualizar', async () => {
    render(<AdminAnalytics onNavigate={mockOnNavigate} />);

    await waitFor(
      () => {
        expect(screen.getByText('Analytics & Insights')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Procurar o botão de atualizar
    const updateButtons = screen.getAllByText('Atualizar');
    expect(updateButtons.length).toBeGreaterThan(0);
  });
});
