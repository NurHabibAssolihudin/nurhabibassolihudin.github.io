import {getCollection} from 'astro:content';
import {getImage} from 'astro:assets';
import type {Project} from '../data/project-types';
import {projectSectionIds} from '../data/navigation';
import {assertProjectOrder} from './project-order';

/** Images are generated during the static build; React receives URLs, not image tooling. */
export async function projectContent(): Promise<Project[]> {
  const entries = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  assertProjectOrder(
    entries.map((entry) => entry.data.id),
    projectSectionIds
  );
  return Promise.all(
    entries.map(async ({data: {image, order: _order, ...project}}) => {
      if (!image) return {...project, image: null};
      const widths = [480, 960, Math.min(1440, image.width)].filter(
        (width, index, all) => width <= image.width && all.indexOf(width) === index
      );
      const variants = await Promise.all(
        widths.map((width) => getImage({src: image, width, format: 'webp', quality: 82}))
      );
      const main = variants[Math.min(1, variants.length - 1)];
      const thumbnail = await getImage({
        src: image,
        width: Math.min(440, image.width),
        format: 'webp',
        quality: 85
      });
      return {
        ...project,
        image: main.src,
        imageSet: variants.map((variant, i) => `${variant.src} ${widths[i]}w`).join(', '),
        imageWidth: Number(main.attributes.width),
        imageHeight: Number(main.attributes.height),
        thumbnail: thumbnail.src
      };
    })
  );
}
