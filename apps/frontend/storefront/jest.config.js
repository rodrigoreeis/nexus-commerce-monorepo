const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^lucide-react$': '<rootDir>/node_modules/lucide-react/dist/cjs/lucide-react.js',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
}

module.exports = createJestConfig(customJestConfig)
