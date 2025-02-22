import { outdent } from 'outdent';
import { lintDocument } from '../../../../lint';
import { parseYamlToDocument, replaceSourceWithRef } from '../../../../../__tests__/utils';
import { LintConfig } from '../../../../config/config';
import { defaultPlugin } from '../../../../config/builtIn';

import { BaseResolver } from '../../../../resolve';

const allConfig = new LintConfig({ plugins: [defaultPlugin], extends: ['all'] });

describe('Oas3 Structural visitor basic', () => {
  it('should report wrong types', async () => {
    const document = parseYamlToDocument(
      outdent`
          openapi: 3.0.0
          tags:
            - 25.3
            - test
          servers:
          - url: 'http://example.com'
            variables:
              a:
                default: test
                enum:
                  - 123
                  - test
          info:
            title: Test
            version: '1.0'
            description: test description
            contact:
              name: string
              url: []
              email: false
            license: invalid
          paths: {}
        `,
      'foobar.yaml',
    );

    const results = await lintDocument({
      externalRefResolver: new BaseResolver(),
      document,
      config: allConfig,
    });

    expect(replaceSourceWithRef(results)).toMatchInlineSnapshot(`
      Array [
        Object {
          "location": Array [
            Object {
              "pointer": "#/info/contact/url",
              "reportOnKey": false,
              "source": "foobar.yaml",
            },
          ],
          "message": "Expected type \`string\` but got \`array\`.",
          "ruleId": "spec",
          "severity": "error",
          "suggest": Array [],
        },
        Object {
          "location": Array [
            Object {
              "pointer": "#/info/contact/email",
              "reportOnKey": false,
              "source": "foobar.yaml",
            },
          ],
          "message": "Expected type \`string\` but got \`boolean\`.",
          "ruleId": "spec",
          "severity": "error",
          "suggest": Array [],
        },
        Object {
          "location": Array [
            Object {
              "pointer": "#/info/license",
              "reportOnKey": false,
              "source": "foobar.yaml",
            },
          ],
          "message": "Expected type \`License\` (object) but got \`string\`",
          "ruleId": "spec",
          "severity": "error",
          "suggest": Array [],
        },
        Object {
          "from": Object {
            "pointer": "#/servers/0/url",
            "source": "foobar.yaml",
          },
          "location": Array [
            Object {
              "pointer": "#/servers/0/variables/a",
              "reportOnKey": true,
              "source": "foobar.yaml",
            },
          ],
          "message": "The \`a\` variable is not used in the server's \`url\` field.",
          "ruleId": "no-undefined-server-variable",
          "severity": "error",
          "suggest": Array [],
        },
        Object {
          "location": Array [
            Object {
              "pointer": "#/servers/0/variables/a/enum/0",
              "reportOnKey": false,
              "source": "foobar.yaml",
            },
          ],
          "message": "Expected type \`string\` but got \`number\`.",
          "ruleId": "spec",
          "severity": "error",
          "suggest": Array [],
        },
        Object {
          "location": Array [
            Object {
              "pointer": "#/tags/0",
              "reportOnKey": false,
              "source": "foobar.yaml",
            },
          ],
          "message": "Expected type \`Tag\` (object) but got \`number\`",
          "ruleId": "spec",
          "severity": "error",
          "suggest": Array [],
        },
        Object {
          "location": Array [
            Object {
              "pointer": "#/tags/1",
              "reportOnKey": false,
              "source": "foobar.yaml",
            },
          ],
          "message": "Expected type \`Tag\` (object) but got \`string\`",
          "ruleId": "spec",
          "severity": "error",
          "suggest": Array [],
        },
      ]
    `);
  });

  it('should report unexpected properties', async () => {
    const document = parseYamlToDocument(
      outdent`
          openapi: 3.0.0
          components1: 1
          info:
            title: Test
            version: '1.0'
            description: test description
            license:
              name: MIT
              url: google.com
            contact:
              name: string
              test: blah
              x-test: vendor
          paths: {}
        `,
      'foobar.yaml',
    );

    const results = await lintDocument({
      externalRefResolver: new BaseResolver(),
      document,
      config: allConfig,
    });

    expect(replaceSourceWithRef(results)).toMatchInlineSnapshot(`
      Array [
        Object {
          "location": Array [
            Object {
              "pointer": "#/components1",
              "reportOnKey": true,
              "source": "foobar.yaml",
            },
          ],
          "message": "Property \`components1\` is not expected here.",
          "ruleId": "spec",
          "severity": "error",
          "suggest": Array [
            "components",
          ],
        },
        Object {
          "location": Array [
            Object {
              "pointer": "#/openapi",
              "reportOnKey": true,
              "source": "foobar.yaml",
            },
          ],
          "message": "Servers must be present.",
          "ruleId": "no-empty-servers",
          "severity": "error",
          "suggest": Array [],
        },
        Object {
          "location": Array [
            Object {
              "pointer": "#/info/contact/test",
              "reportOnKey": true,
              "source": "foobar.yaml",
            },
          ],
          "message": "Property \`test\` is not expected here.",
          "ruleId": "spec",
          "severity": "error",
          "suggest": Array [],
        },
      ]
    `);
  });

  it('should report required properties missing', async () => {
    const document = parseYamlToDocument(
      outdent`
          openapi: 3.0.0
          info:
            version: '1.0'
            description: test description
            license:
              name: MIT
              url: google.com
            contact:
              name: string
        `,
      'foobar.yaml',
    );

    const results = await lintDocument({
      externalRefResolver: new BaseResolver(),
      document,
      config: allConfig,
    });

    expect(replaceSourceWithRef(results)).toMatchInlineSnapshot(`
      Array [
        Object {
          "location": Array [
            Object {
              "pointer": "#/",
              "reportOnKey": true,
              "source": "foobar.yaml",
            },
          ],
          "message": "The field \`paths\` must be present on this level.",
          "ruleId": "spec",
          "severity": "error",
          "suggest": Array [],
        },
        Object {
          "location": Array [
            Object {
              "pointer": "#/openapi",
              "reportOnKey": true,
              "source": "foobar.yaml",
            },
          ],
          "message": "Servers must be present.",
          "ruleId": "no-empty-servers",
          "severity": "error",
          "suggest": Array [],
        },
        Object {
          "location": Array [
            Object {
              "pointer": "#/info",
              "reportOnKey": true,
              "source": "foobar.yaml",
            },
          ],
          "message": "The field \`title\` must be present on this level.",
          "ruleId": "spec",
          "severity": "error",
          "suggest": Array [],
        },
      ]
    `);
  });
});
