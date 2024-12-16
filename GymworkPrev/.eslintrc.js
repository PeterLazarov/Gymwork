// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'standard',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint'],
  globals: {
    __DEV__: false,
    jasmine: false,
    beforeAll: false,
    afterAll: false,
    beforeEach: false,
    afterEach: false,
    test: false,
    expect: false,
    describe: false,
    jest: false,
    it: false,
  },
  rules: {
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-object-literal-type-assertion': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-use-before-define': 0,
    // '@typescript-eslint/no-non-null-assertion': 0,
    'comma-dangle': 0,
    'multiline-ternary': 0,
    'no-undef': 0,
    'no-unused-vars': 0,
    'no-use-before-define': 'off',
    'no-prototype-builtins': 'off',
    'no-redeclare': 'off',
    quotes: 0,
    'space-before-function-paren': 0,
    'react-hooks/exhaustive-deps': 0,
    'import/no-named-as-default-member': 0,
    'no-restricted-imports': [
      'error',
      {
        name: 'react-native',
        importNames: ['Text'],
        message: "Please use 'Text' from designSystem instead",
      },
      {
        name: 'i18n-js',
        importNames: ['translate'],
        message: "Are you sure you don't need the one from app/i18n?",
      },
    ],
  },
  settings: {
    // 'import/resolver': {
    //   // You will also need to install and configure the TypeScript resolver
    //   // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
    //   typescript: true,
    //   node: true,
    // },
  },
  ignorePatterns: ['**/*.snap', '**/*.txt', 'bin/ignite'],
}