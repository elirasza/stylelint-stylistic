export default {
  collectCoverageFrom: [
    '/lib/**/*.js',
    '/lib/**/*.ts',
    '!/lib/**/*.d.ts',
  ],
  coverageDirectory: '.jest/coverage',
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  preset: 'jest-preset-stylelint',
  rootDir: './..',
  setupFilesAfterEnv: [
    './.jest/jest.setup.ts',
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      isolatedModules: true,
    }],
  },
  verbose: true,
}
