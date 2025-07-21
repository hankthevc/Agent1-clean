module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\.(css|less)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\.(ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/'],
  moduleDirectories: ['node_modules', '.'],
};
