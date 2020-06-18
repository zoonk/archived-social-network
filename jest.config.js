module.exports = {
  preset: 'ts-jest',
  setupFiles: ['core-js'],
  moduleNameMapper: {
    // https://github.com/kulshekhar/ts-jest/issues/414
    '@zoonk/(.*)': '<rootDir>/src/$1',
  },
};
