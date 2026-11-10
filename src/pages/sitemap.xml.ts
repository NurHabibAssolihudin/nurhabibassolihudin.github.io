import type {APIRoute} from 'astro';
import {projectContent} from '../lib/project-content';

export const GET: APIRoute = async ({site}) => {
  if (!site) throw new Error('Sitemap requires the canonical site URL');
  const absolute = (path: string) => new URL(path, site).href;
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const projects = await projectContent();
  const groups = [
    {en: '/en/', id: '/id/', 'x-default': '/'},
    ...projects.map(project => {
      const slug = project.id.replace('project-', '');
      return {en: `/en/projects/${slug}/`, id: `/id/projects/${slug}/`, 'x-default': `/en/projects/${slug}/`};
    })
  ];
  const entries = groups.flatMap(group => {
    const alternates = Object.entries(group).map(([language, path]) =>
      `    <xhtml:link rel="alternate" hreflang="${language}" href="${escape(absolute(path))}" />`
    ).join('\n');
    return [...new Set(Object.values(group))].map(path =>
      `  <url>\n    <loc>${escape(absolute(path))}</loc>\n${alternates}\n  </url>`
    );
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`, {
    headers: {'Content-Type': 'application/xml; charset=utf-8'}
  });
};
