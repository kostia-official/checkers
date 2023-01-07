const path = require('path');
const jestConfig = require('./jest.config');

const resolvePath = (p) => path.resolve(__dirname, p);

module.exports = {
  webpack: {
    alias: {
      '@src': resolvePath('./src'),
      '@components': resolvePath('./src/components'),
      '@common': resolvePath('./src/common'),
      '@pages': resolvePath('./src/pages'),
      '@services': resolvePath('./src/services'),
      '@strategies': resolvePath('./src/strategies'),
    },
  },
  jest: {
    configure: jestConfig,
  },
};
