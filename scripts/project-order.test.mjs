import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assertProjectOrder} from '../src/lib/project-order.ts';
import {projectSectionIds} from '../src/data/navigation.ts';

test('published project order agrees with the picker and chapter navigation', () => {
  assert.doesNotThrow(() => assertProjectOrder([...projectSectionIds], projectSectionIds));
});
test('reordered, missing, duplicate or unknown project IDs fail before publishing', () => {
  for (const ids of [
    [...projectSectionIds].reverse(),
    projectSectionIds.slice(1),
    [projectSectionIds[0], projectSectionIds[0], projectSectionIds[2]],
    [...projectSectionIds, 'project-unknown']
  ])
    assert.throws(
      () => assertProjectOrder(ids, projectSectionIds),
      /must match src\/data\/navigation/
    );
});
