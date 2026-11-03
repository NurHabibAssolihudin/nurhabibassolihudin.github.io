// Keep section navigation independent from the bilingual project descriptions.
export const projectSectionIds = ['project-orca', 'project-ocaty', 'project-oxelot'];
export const chapterIds = ['top', 'summary', 'work', ...projectSectionIds, 'experience-work', 'approach', 'contact'];
export const creatorIds = ['ctop', 'worlds', 'craft', 'tools', 'play'];
export const chapterAliases: Record<string, string> = {platforms: 'summary', stack: 'approach', about: 'summary'};
