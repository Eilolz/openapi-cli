import { Config, getMergedConfig } from '../config';

const testConfig: Config = {
  rawConfig: {
    apis: {
      'test@v1': {
        root: 'resources/pets.yaml',
        lint: { extends: [], rules: { 'operation-summary': 'warn' } },
      },
    },
    organization: 'redocly-test',
    lint: {
      extends: [],
      rules: { 'operation-summary': 'error', 'no-empty-servers': 'error' },
      plugins: [],
    },
  },
  configFile: 'redocly.yaml',
  apis: {
    'test@v1': {
      root: 'resources/pets.yaml',
      lint: { extends: [], rules: { 'operation-summary': 'warn' } },
    },
  },
  // @ts-ignore
  lint: {
    rawConfig: {
      extends: [],
      rules: { 'operation-summary': 'error', 'no-empty-servers': 'error' },
      plugins: [],
    },
    configFile: 'redocly.yaml',
    ignore: {},
    _usedRules: new Set(),
    _usedVersions: new Set(),
    recommendedFallback: false,
    plugins: [],
    doNotResolveExamples: false,
    rules: {
      oas2: { 'operation-summary': 'error', 'no-empty-servers': 'error' },
      oas3_0: { 'operation-summary': 'error', 'no-empty-servers': 'error' },
      oas3_1: { 'operation-summary': 'error', 'no-empty-servers': 'error' },
    },
    preprocessors: { oas2: {}, oas3_0: {}, oas3_1: {} },
    decorators: { oas2: {}, oas3_0: {}, oas3_1: {} },
  },
  'features.openapi': {},
  'features.mockServer': {},
  resolve: { http: { headers: [] } },
  organization: 'redocly-test',
};

describe('getMergedConfig', () => {
  it('should merge lint defined in "apis" section the root one', () => {
    expect(getMergedConfig(testConfig, 'test@v1')).toMatchInlineSnapshot(`
      Config {
        "apis": Object {
          "test@v1": Object {
            "lint": Object {
              "extends": Array [],
              "rules": Object {
                "operation-summary": "warn",
              },
            },
            "root": "resources/pets.yaml",
          },
        },
        "configFile": "redocly.yaml",
        "features.mockServer": Object {},
        "features.openapi": Object {},
        "lint": LintConfig {
          "_usedRules": Set {},
          "_usedVersions": Set {},
          "configFile": "redocly.yaml",
          "decorators": Object {
            "oas2": Object {},
            "oas3_0": Object {},
            "oas3_1": Object {},
          },
          "doNotResolveExamples": false,
          "ignore": Object {},
          "plugins": Array [],
          "preprocessors": Object {
            "oas2": Object {},
            "oas3_0": Object {},
            "oas3_1": Object {},
          },
          "rawConfig": Object {
            "decorators": Object {},
            "extends": Array [],
            "plugins": Array [],
            "preprocessors": Object {},
            "rules": Object {
              "no-empty-servers": "error",
              "operation-summary": "warn",
            },
          },
          "recommendedFallback": false,
          "rules": Object {
            "oas2": Object {
              "no-empty-servers": "error",
              "operation-summary": "warn",
            },
            "oas3_0": Object {
              "no-empty-servers": "error",
              "operation-summary": "warn",
            },
            "oas3_1": Object {
              "no-empty-servers": "error",
              "operation-summary": "warn",
            },
          },
        },
        "organization": "redocly-test",
        "rawConfig": Object {
          "apis": Object {
            "test@v1": Object {
              "lint": Object {
                "extends": Array [],
                "rules": Object {
                  "operation-summary": "warn",
                },
              },
              "root": "resources/pets.yaml",
            },
          },
          "features.mockServer": Object {},
          "features.openapi": Object {},
          "lint": Object {
            "decorators": Object {},
            "extends": Array [],
            "plugins": Array [],
            "preprocessors": Object {},
            "rules": Object {
              "no-empty-servers": "error",
              "operation-summary": "warn",
            },
          },
          "organization": "redocly-test",
        },
        "region": undefined,
        "resolve": Object {
          "http": Object {
            "customFetch": undefined,
            "headers": Array [],
          },
        },
      }
    `);
  });
  it('should take into account a config file', () => {
    const result = getMergedConfig(testConfig, 'test@v1');
    expect(result.configFile).toEqual('redocly.yaml');
    expect(result.lint.configFile).toEqual('redocly.yaml');
  });
  it('should return the same config when there is no alias provided', () => {
    expect(getMergedConfig(testConfig)).toEqual(testConfig);
  });
  it('should handle wrong alias - return the same lint, empty features', () => {
    expect(getMergedConfig(testConfig, 'wrong-alias')).toMatchInlineSnapshot(`
      Config {
        "apis": Object {
          "test@v1": Object {
            "lint": Object {
              "extends": Array [],
              "rules": Object {
                "operation-summary": "warn",
              },
            },
            "root": "resources/pets.yaml",
          },
        },
        "configFile": "redocly.yaml",
        "features.mockServer": Object {},
        "features.openapi": Object {},
        "lint": LintConfig {
          "_usedRules": Set {},
          "_usedVersions": Set {},
          "configFile": "redocly.yaml",
          "decorators": Object {
            "oas2": Object {},
            "oas3_0": Object {},
            "oas3_1": Object {},
          },
          "doNotResolveExamples": false,
          "ignore": Object {},
          "plugins": Array [],
          "preprocessors": Object {
            "oas2": Object {},
            "oas3_0": Object {},
            "oas3_1": Object {},
          },
          "rawConfig": Object {
            "decorators": Object {},
            "extends": Array [],
            "plugins": Array [],
            "preprocessors": Object {},
            "rules": Object {
              "no-empty-servers": "error",
              "operation-summary": "error",
            },
          },
          "recommendedFallback": false,
          "rules": Object {
            "oas2": Object {
              "no-empty-servers": "error",
              "operation-summary": "error",
            },
            "oas3_0": Object {
              "no-empty-servers": "error",
              "operation-summary": "error",
            },
            "oas3_1": Object {
              "no-empty-servers": "error",
              "operation-summary": "error",
            },
          },
        },
        "organization": "redocly-test",
        "rawConfig": Object {
          "apis": Object {
            "test@v1": Object {
              "lint": Object {
                "extends": Array [],
                "rules": Object {
                  "operation-summary": "warn",
                },
              },
              "root": "resources/pets.yaml",
            },
          },
          "features.mockServer": Object {},
          "features.openapi": Object {},
          "lint": Object {
            "decorators": Object {},
            "extends": Array [],
            "plugins": Array [],
            "preprocessors": Object {},
            "rules": Object {
              "no-empty-servers": "error",
              "operation-summary": "error",
            },
          },
          "organization": "redocly-test",
        },
        "region": undefined,
        "resolve": Object {
          "http": Object {
            "customFetch": undefined,
            "headers": Array [],
          },
        },
      }
    `);
  });
});
