import { Collaborator } from './collaborator';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string | null;
  detailImage?: string | null;
  gallery_images?: string[];
  tags: string[];
  reactions?: Record<string, number>;
  commentCount?: number;
  collaborators?: Collaborator[];
}
