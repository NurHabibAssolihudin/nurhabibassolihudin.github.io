import {test, after} from 'node:test';
import assert from 'node:assert/strict';
import {prepareProjectImage} from '../src/lib/project-images.ts';

const original = {
  Image: globalThis.Image,
  innerWidth: globalThis.innerWidth,
  devicePixelRatio: globalThis.devicePixelRatio
};
globalThis.innerWidth = 1440;
globalThis.devicePixelRatio = 1;
after(() => {
  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete globalThis[key];
    else globalThis[key] = value;
  }
});
const project = (image) => ({image});

test('repeated preparation shares a request, while a responsive size change prepares again', async () => {
  let count = 0;
  globalThis.Image = class {
    decode() {
      count++;
      return Promise.resolve();
    }
  };
  const item = project('/test/responsive.webp'),
    first = prepareProjectImage(item);
  assert.equal(prepareProjectImage(item), first);
  assert.equal(await first, true);
  globalThis.innerWidth = 390;
  assert.equal(await prepareProjectImage(item), true);
  assert.equal(count, 2);
  globalThis.innerWidth = 1440;
});
test('a failed image can be retried instead of staying cached as a failure', async () => {
  let count = 0;
  globalThis.Image = class {
    decode() {
      return ++count === 1 ? Promise.reject(Error('network')) : Promise.resolve();
    }
  };
  const item = project('/test/retry.webp');
  assert.equal(await prepareProjectImage(item), false);
  assert.equal(await prepareProjectImage(item), true);
  assert.equal(count, 2);
});
test('a resize-heavy session evicts old image preparations instead of growing without limit', async () => {
  const requests = [];
  globalThis.Image = class {
    decode() {
      requests.push(this.src);
      return Promise.resolve();
    }
  };
  const item = project('/test/old.webp');
  await prepareProjectImage(item);
  for (let i = 0; i < 32; i++) await prepareProjectImage(project(`/test/evict-${i}.webp`));
  await prepareProjectImage(item);
  assert.equal(requests.filter((src) => src === item.image).length, 2);
});
test('a failing evicted request cannot delete a newer preparation for the same image', async () => {
  let rejectOld,
    resolveNew,
    count = 0;
  globalThis.Image = class {
    decode() {
      if (this.src === '/test/race.webp')
        return ++count === 1
          ? new Promise((_, reject) => {
              rejectOld = reject;
            })
          : new Promise((resolve) => {
              resolveNew = resolve;
            });
      return Promise.resolve();
    }
  };
  const item = project('/test/race.webp'),
    old = prepareProjectImage(item);
  for (let i = 0; i < 32; i++) await prepareProjectImage(project(`/test/race-evict-${i}.webp`));
  const current = prepareProjectImage(item);
  rejectOld(Error('late failure'));
  assert.equal(await old, false);
  assert.equal(prepareProjectImage(item), current);
  resolveNew();
  assert.equal(await current, true);
});
