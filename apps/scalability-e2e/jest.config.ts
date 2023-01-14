/* eslint-disable */
export default {
  name: 'scalability-e2e',
  preset: '../../jest.preset.js',
  rootDir: '.',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  testMatch: ['**/+(*.)+(e2e-spec|e2e-test).+(ts|js)?(x)'],
  coverageDirectory: '../../coverage/apps/api/e2e',
  moduleFileExtensions: ['ts', 'js', 'html'],
};
