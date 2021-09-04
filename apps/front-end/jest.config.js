/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  reporters: ['./src/JestReporter.js'],
  testMatch: ['**/src/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
}

module.exports = config
