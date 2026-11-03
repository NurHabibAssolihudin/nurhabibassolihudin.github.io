import type {PickerProject} from '../data/project-types';
const prepared = new Map<string, Promise<boolean>>();
const cacheLimit = 16;

export function prepareProjectImage(project: PickerProject): Promise<boolean> {
  if (!project.image || typeof Image === 'undefined') return Promise.resolve(false);
  const key = `${project.image}|${innerWidth}|${devicePixelRatio}`;
  const cached = prepared.get(key);
  if (cached) {
    prepared.delete(key);
    prepared.set(key, cached);
    return cached;
  }
  const image = new Image();
  image.decoding = 'async';
  if (project.imageSet) {
    image.sizes = '100vw';
    image.srcset = project.imageSet;
  }
  image.src = project.image;
  const pending = image.decode().then(
    () => true,
    () => {
      // An older evicted request must not remove a newer preparation for this key.
      if (prepared.get(key) === pending) prepared.delete(key);
      return false;
    }
  );
  prepared.set(key, pending);
  if (prepared.size > cacheLimit) prepared.delete(prepared.keys().next().value!);
  return pending;
}
