import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chooseLanguage } from '../src/lib/language.mjs';

test('explicit language and remembered choice win over browser preference', () => {
  assert.equal(chooseLanguage({ explicit: 'en', saved: 'id', languages: ['id-ID'] }), 'en');
  assert.equal(chooseLanguage({ saved: 'id', languages: ['en-US'] }), 'id');
});
test('Indonesian and English regional browser variants select their language', () => {
  assert.equal(chooseLanguage({ languages: ['id-ID'] }), 'id');
  assert.equal(chooseLanguage({ languages: ['en-US'] }), 'en');
  assert.equal(chooseLanguage({ languages: ['EN-gb'] }), 'en');
});
test('browser fallback respects preference order and rejects invalid choices', () => {
  assert.equal(chooseLanguage({ languages: ['id-ID', 'en-US'] }), 'id');
  assert.equal(chooseLanguage({ languages: ['en-GB', 'id'] }), 'en');
  assert.equal(chooseLanguage({ explicit: 'javascript:bad', saved: 'xx', languages: ['ja', 'id'] }), 'id');
  assert.equal(chooseLanguage({ languages: ['ja'] }), 'en');
  assert.equal(chooseLanguage(), 'en');
});
