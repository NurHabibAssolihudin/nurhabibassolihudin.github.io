import type {Copy} from './professional';

export interface Project {
  id: string;
  name: string;
  kind: Copy;
  summary: Copy;
  caseStudy: {
    problem: Copy;
    constraints: Copy;
    role: Copy;
    system: Copy;
    decisions: {title: Copy; body: Copy}[];
    tradeoffs: Copy;
    outcome: Copy;
    learning?: Copy;
  };
  technologies: string[];
  links: {label: Copy; url: string}[];
  image: string | null;
  imageSet?: string;
  imageWidth?: number;
  imageHeight?: number;
  thumbnail?: string;
  original?: string;
}
export type PickerProject = Pick<
  Project,
  'id' | 'name' | 'kind' | 'summary' | 'image' | 'imageSet' | 'imageWidth' | 'imageHeight'
>;
