import type {Copy} from './professional';

export interface Project {
  id: string;
  name: string;
  kind: Copy;
  summary: Copy;
  context: Copy;
  focus: Copy;
  reviewTitle: Copy;
  evidence: Copy;
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
