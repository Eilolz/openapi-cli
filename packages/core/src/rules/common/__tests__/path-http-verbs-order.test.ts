import { outdent } from 'outdent';
import { lintDocument } from '../../../lint';
import { parseYamlToDocument, replaceSourceWithRef, makeConfig } from '../../../../__tests__/utils';
import { BaseResolver } from '../../../resolve';

describe('Common path-http-verbs-order', () => {
  it('should report on invalid order', async () => {
    const document = parseYamlToDocument(
      outdent`
        openapi: 3.0.0
        paths:
          /some:
            put:
              summary: put
            post:
              summary: post
            get:
              summary: post
      `,
      'foobar.yaml',
    );

    const results = await lintDocument({
      externalRefResolver: new BaseResolver(),
      document,
      config: makeConfig({ 'path-http-verbs-order': 'error' }),
    });

    expect(replaceSourceWithRef(results)).toMatchInlineSnapshot(`
      Array [
        Object {
          "location": Array [
            Object {
              "pointer": "#/paths/~1some/post",
              "reportOnKey": true,
              "source": "foobar.yaml",
            },
          ],
          "message": "Operation http verbs must be ordered.",
          "ruleId": "path-http-verbs-order",
          "severity": "error",
          "suggest": Array [],
        },
        Object {
          "location": Array [
            Object {
              "pointer": "#/paths/~1some/get",
              "reportOnKey": true,
              "source": "foobar.yaml",
            },
          ],
          "message": "Operation http verbs must be ordered.",
          "ruleId": "path-http-verbs-order",
          "severity": "error",
          "suggest": Array [],
        },
      ]
    `);
  });

  it('should not report valid order', async () => {
    const document = parseYamlToDocument(
      outdent`
      openapi: 3.0.0
      paths:
        /some:
          get:
            summary: get
          head:
            summary: head
          post:
            summary: post
          put:
            summary: put
          patch:
            summary: patch
          delete:
            summary: delete
          options:
            summary: options
          trace:
            summary: trace
        `,
      'foobar.yaml',
    );

    const results = await lintDocument({
      externalRefResolver: new BaseResolver(),
      document,
      config: makeConfig({ 'path-http-verbs-order': 'error' }),
    });

    expect(replaceSourceWithRef(results)).toMatchInlineSnapshot(`Array []`);
  });
});
