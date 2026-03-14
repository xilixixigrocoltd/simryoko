module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'api/**/*.js',
    '!api/node_modules/**'
  ]
};
