import {
  baseConfig,
  configFilesConfig,
  typescriptConfig,
  typescriptDefinitionsConfig,
} from '@arabasta/eslint-config';
// import/no-unresolved doesn't support node "exports" field. https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import playwright from 'eslint-plugin-playwright';
// import/no-unresolved doesn't support node "exports" field. https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';

const typeScriptExtensions = ['ts', 'cts', 'mts', 'tsx'];

const typeScriptDefinitionExtensions = typeScriptExtensions
  .filter((x) => x !== 'tsx')
  .map((x) => `d.${x}`);

const allExtensions = ['js', 'cjs', 'mjs', 'jsx', ...typeScriptExtensions];

export default [
  // We use a tseslint helper function here so that we get easy "extends"
  // functionality that eslint flat config makes hard to achieve.
  // You can use this for the convenience, without using TypeScript.
  // Ideally this helper function should be provided by eslint.
  // For more information: https://typescript-eslint.io/packages/typescript-eslint/#flat-config-extends
  ...tseslint.config({
    name: 'All files',
    files: [`**/*.+(${allExtensions.join('|')})`],
    extends: [...baseConfig],
    settings: {
      'import/extensions': allExtensions.map((ext) => `.${ext}`),
      'import/resolver': {
        node: {
          extensions: allExtensions.map((ext) => `.${ext}`),
        },
      },
    },
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './',
              from: `./src/**/*.+(spec|test).+(${allExtensions.join('|')})`,
              message: 'Importing test files in non-test files is not allowed.',
            },
            {
              target: './',
              from: `./__mocks__`,
              message:
                'Importing mock modules in non-test files is not allowed.',
            },
            {
              target: './',
              from: './src/testing',
              message:
                'Importing testing utilities in non-test files is not allowed.',
            },
          ],
        },
      ],
    },
  }),

  ...tseslint.config({
    name: 'TypeScript files',
    files: [`**/*.+(${typeScriptExtensions.join('|')})`],
    extends: [...typescriptConfig],
    rules: {
      // Put your rules here.
    },
  }),

  ...tseslint.config({
    name: 'TypeScript definition files',
    files: [`**/*.+(${typeScriptDefinitionExtensions.join('|')})`],
    extends: [...typescriptDefinitionsConfig],
    rules: {
      // Put your rules here.
    },
  }),

  ...tseslint.config({
    name: 'Test files and test related infrastructure',
    files: [
      `src/**/*.+(spec|test).+(${allExtensions.join('|')})`,
      `src/testing/**/*.+(${allExtensions.join('|')})`,
      `__mocks__/**/*.+(${allExtensions.join('|')})`,
      'setupTests.ts',
    ],
    extends: [playwright.configs['flat/recommended']],
    rules: {
      'playwright/no-page-pause': 'off',
      'playwright/max-nested-describe': ['error', { max: 2 }],
      'playwright/no-raw-locators': 'error',
      'playwright/prefer-to-be': 'error',
      'playwright/prefer-to-contain': 'error',
      'playwright/prefer-to-have-count': 'error',
      'playwright/prefer-to-have-length': 'error',
      'playwright/no-skipped-test': 'error',
      'playwright/expect-expect': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/no-eval': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-nested-step': 'error',
      'playwright/no-useless-await': 'error',
      'playwright/no-useless-not': 'error',
      'playwright/no-wait-for-selector': 'error',
      'playwright/no-wait-for-timeout': 'error',
    },
  }),

  ...tseslint.config({
    name: 'Root level configuration files',
    files: [
      `*.+(${allExtensions.join('|')})`,
      `__mocks__/**/*.+(${allExtensions.join('|')})`,
    ],
    extends: [...configFilesConfig],
    rules: {
      // Put your rules here.
    },
  }),

  {
    ignores: [
      'dist',
      'coverage',
      'mock-app',
      'tests-out',
      'tests-results',
      'playwright',
      'playwright-report',
    ],
  },
];
