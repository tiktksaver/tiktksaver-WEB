module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh'
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-console': 'off',
    'guard-for-in': 'error',
    'semi': [
      'error',
      'always'
    ],
    'no-loop-func': 'error',
    'no-sync': 'error',
    'no-template-curly-in-string': 'error',
    'block-scoped-var': 'error',
    'dot-notation': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'curly': [
      'error',
      'multi-line',
      'consistent'
    ],
    'no-trailing-spaces': 'error',
    'no-irregular-whitespace': 'error',
    'space-infix-ops': 'error',
    'brace-style': 'error',
    'comma-spacing': 'error',
    'key-spacing': 'off',
    'space-before-blocks': 'error',
    'no-multi-spaces': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    'indent': [
      'error',
      4,
      {
        'SwitchCase': 1
      }
    ]
  },
}
