// Setup para testes Jest
// Configurações globais antes de rodar os testes

// Variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_ACCESS_EXPIRATION = '15m';
process.env.JWT_REFRESH_EXPIRATION = '7d';

// Mock console para testes mais limpos (opcional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   error: jest.fn(),
// };
