module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    "import/resolver": {
      alias: {
        map: [
          ['@assets', './src/assets'],
          ['@styles', './src/styles'],
          ['@types', './src/types'],
          ['@utils', './src/utils'],
        ],
        extensions: ['.ts', '.tsx'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react-refresh','@typescript-eslint'],
  ignorePatterns: ['vite.config.ts'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/function-component-definition': 0,
    'import/no-extraneous-dependencies': 0,
    'react/jsx-one-expression-per-line': 'off',
    '@typescript-eslint/quotes': [2,'double'],
    '@typescript-eslint/no-shadow':'off',
    '@typescript-eslint/indent': 'off',
    'import/no-unresolved': 'error',
    'react/jsx-indent': 'off',
    'implicit-arrow-linebreak': 0,
    'function-paren-newline': 0,
    'react/jsx-indent-props': ['error', 4],
    'react/jsx-uses-react': 'off',
    'arrow-body-style': 0,
    'react/react-in-jsx-scope': 'off',
    'import/extensions':  0,
    'operator-linebreak': 0,
    'no-param-reassign': 0,
    'linebreak-style': 0,
    'max-len': ['error', { code: 120 }],
    '@typescript-eslint/comma-dangle': [
      'off',
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'never',
        'exports': 'never',
        'functions': 'never'
      }
    ],
  },
}
