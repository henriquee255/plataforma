export default {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Module paths
  moduleNameMapper: {
    // Mock CSS/SCSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Mock static file imports
    '\\.(jpg|jpeg|png|gif|svg|webp|ico)$': '<rootDir>/src/__mocks__/fileMock.js',

    // Mock Recharts
    '^recharts$': '<rootDir>/src/__mocks__/rechartsMock.js',
  },

  // Transform files
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Test match patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/__mocks__/**',
    '!src/main.jsx',
    '!src/index.jsx',
  ],

  // Coverage thresholds (Story 2.1: Setup only)
  // Will be increased to 70% in Story 2.2
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },

  // Coverage directory
  coverageDirectory: 'coverage',

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
  ],

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json'],

  // Verbose output
  verbose: true,
};
