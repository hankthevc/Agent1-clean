module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\.(css|less)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\.(ts|tsx)$': 'babel-jest',
  },
};
