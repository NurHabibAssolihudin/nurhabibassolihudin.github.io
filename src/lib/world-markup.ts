import creatorSource from '../../templates/creator.html?raw';
import headerSource from '../../templates/header.html?raw';
import footerSource from '../../templates/footer.html?raw';
import planetSource from '../../templates/planet.html?raw';
import dictionary from '../../locales/id.json';

export type Language = 'en' | 'id';
export function worldMarkup(language: Language) {
  const translations = dictionary as Record<string, string>;
  function translate(source: string) {
    return source.split(/(<!--[\s\S]*?-->|<[^>]+>)/g).map(part => {
      if (language !== 'id' || part.startsWith('<!--')) return part;
      if (part.startsWith('<')) return part.replace(/(alt|aria-label|content)="([^"]*)"/g, (all, key, value) => translations[value] ? `${key}="${translations[value].replaceAll('"', '&quot;')}"` : all);
      const key = part.trim();
      return translations[key] ? part.replace(key, translations[key]) : part;
    }).join('').replaceAll('src="assets/', 'src="/assets/').trim();
  }
  const nav = [
    ['summary', 'Overview', 'Ringkasan'], ['work', 'Work', 'Pekerjaan'],
    ['experience-work', 'Experience', 'Pengalaman'], ['contact', 'Contact', 'Kontak'],
  ].map(([hash, en, id]) => `<a href="#${hash}">${language === 'id' ? id : en}</a>`).join('\n');
  return {
    header: translate(headerSource).replaceAll('<!-- professional-nav -->', nav),
    creator: translate(creatorSource), footer: translate(footerSource), planet: translate(planetSource),
  };
}
