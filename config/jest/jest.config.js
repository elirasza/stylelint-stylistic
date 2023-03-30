module.exports = {
  collectCoverageFrom: [
    '**/index.js',
  ],
  coverageDirectory: 'config/jest/coverage',
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
  rootDir: './../..',
  setupFilesAfterEnv: [
    './config/jest/jest.setup.js',
  ],
  verbose: true,
}
