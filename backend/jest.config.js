export default {
  testEnvironment: 'node',
  transform: {},
  testTimeout: 10000,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'utils/**/*.js',
    '!**/*.test.js',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 65,
      lines: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
