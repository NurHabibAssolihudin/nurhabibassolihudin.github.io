import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';

const copy = z.object({en: z.string().min(1), id: z.string().min(1)});
const projects = defineCollection({
  loader: glob({pattern: '*.json', base: './src/content/projects'}),
  schema: ({image}) =>
    z.object({
      id: z.string().regex(/^project-[a-z0-9-]+$/),
      order: z.number().int().nonnegative(),
      name: z.string().min(1),
      image: image().nullable(),
      original: z.string().startsWith('/assets/').optional(),
      kind: copy,
      summary: copy,
      caseStudy: z.object({
        problem: copy,
        constraints: copy,
        role: copy,
        system: copy,
        decisions: z.array(z.object({title: copy, body: copy})).min(1),
        tradeoffs: copy,
        outcome: copy,
        learning: copy.optional()
      }),
      technologies: z.array(z.string().min(1)),
      links: z.array(z.object({label: copy, url: z.url()}))
    })
});
const games = defineCollection({
  loader: glob({pattern: '*.json', base: './src/content/games'}),
  schema: z.object({
    order: z.number().int().nonnegative(),
    flip: z.boolean(),
    crest: copy,
    name: copy,
    meta: copy,
    body: copy,
    stack: copy
  })
});
export const collections = {projects, games};
