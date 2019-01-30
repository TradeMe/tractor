module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Coverage is disabled by default, enabled with npm scripts
  collectCoverage: false,
  coverageDirectory: './reports',
  coveragePathIgnorePatterns: ['node_modules', 'dist']
};
