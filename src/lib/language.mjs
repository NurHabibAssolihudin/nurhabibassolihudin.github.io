export const supported = (value) => value === 'id' || value === 'en';

export function browserLanguage(languages = []) {
  for (const language of languages) {
    const base = String(language).toLowerCase().split('-')[0];
    if (supported(base)) return base;
  }
  return 'en';
}

export function chooseLanguage({ explicit, saved, languages } = {}) {
  if (supported(explicit)) return explicit;
  if (supported(saved)) return saved;
  return browserLanguage(languages);
}
