/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^lucide-react$': require.resolve('lucide-react'),
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.cjs',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [2307],
        },
        tsconfig: {
          jsx: 'react-jsx',
          target: 'ES2022',
          module: 'CommonJS',
          moduleResolution: 'node',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          skipLibCheck: true,
          baseUrl: '.',
          types: ['@testing-library/jest-dom', 'jest'],
          paths: {
            '@/*': ['src/*'],
          },
        },
      },
    ],
  },
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
}
