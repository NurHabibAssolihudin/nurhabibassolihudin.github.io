import {test} from 'node:test';
import assert from 'node:assert/strict';
import {decodeFragment} from '../src/lib/url-fragment.ts';

test('plain, empty and percent-encoded section fragments resolve consistently', () => {
  assert.equal(decodeFragment('#summary'), 'summary');
  assert.equal(decodeFragment(''), '');
  assert.equal(decodeFragment('#%73ummary'), 'summary');
  assert.equal(decodeFragment('#project%2Dorca'), 'project-orca');
});
test('malformed percent and UTF-8 fragments remain harmless unknown anchors', () => {
  for (const fragment of ['#%', '#%E0%A4%A', '#%FF', '#abc%2'])
    assert.equal(decodeFragment(fragment), fragment.slice(1));
});
