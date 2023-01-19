const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  reporters: ['jest-progress-bar-reporter'],
  moduleNameMapper: {
    '^@src(.*)$': '<rootDir>/src$1',
    '^@services(.*)$': '<rootDir>/src/services$1',
    '^@common(.*)$': '<rootDir>/src/common$1',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@strategies(.*)$': '<rootDir>/src/strategies$1',
  },
};

module.exports = config;
