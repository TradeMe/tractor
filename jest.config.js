module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: false,

  // Coverage is disabled by default, enabled with npm scripts
  collectCoverage: false,
  coverageDirectory: './reports',
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  coveragePathIgnorePatterns: ['node_modules', 'dist', 'fixtures', 'test'],

  testRunner: 'jest-circus/runner'
};
