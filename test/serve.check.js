// The static server (scripts/serve.mjs) over the built site: a malformed
// path answers 400 and the server keeps serving; a path out of dist is
// refused. It needs the build, so npm test runs it after the build, once.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { start } from '../scripts/serve.mjs';

/** A GET of a raw path, as sent. @param {number} port @param {string} path @returns {Promise<number>} */
const get = (port, path) =>
  new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port, path, method: 'GET' }, res => {
      res.resume();
      res.on('end', () => resolve(res.statusCode ?? 0));
    });
    req.on('error', reject);
    req.end();
  });

describe('the server', () => {
  // A bound: a request left unanswered fails the test, and the server closes after it however it ends.
  it('answers a malformed path with 400 and keeps serving', { timeout: 10000 }, async t => {
    const server = await start({ port: 0 });
    t.after(async () => {
      // A request still open would keep close from finishing.
      server.closeAllConnections();
      await new Promise(resolve => server.close(() => resolve(undefined)));
    });
    const port = /** @type {import('node:net').AddressInfo} */ (server.address()).port;
    assert.equal(await get(port, '/%E0%A4%A'), 400);
    assert.equal(await get(port, '/'), 200, 'still serving');
    assert.equal(await get(port, '/..%2Fdist-other%2Findex.html'), 403, 'a sibling of dist is refused');
  });
});
