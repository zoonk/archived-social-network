import { Node } from 'slate';
import { Chapter } from './chapter';
import { ContentMetadata } from './content';
import { Group } from './group';
import { Profile } from './profile';
import { SearchIndex } from './search';

export namespace Post {
  export interface Link {
    description: string | null;
    image: string | null;
    title: string;
    url: string;
  }

  export type Category =
    | 'books'
    | 'courses'
    | 'examples'
    | 'lessons'
    | 'posts'
    | 'questions'
    | 'references';
  export type OrderBy = 'likes';

  export interface Summary {
    cover: string | null;
    description: string;
    id: string;
    title: string;
  }

  export interface NextLesson {
    chapterId: string;
    lessonId: string;
  }

  export interface EditableFields {
    content: string;
    cover: string | null;
    links: string[] | null;
    pinned: boolean;
    subtitle: string;
    title: string;
  }

  export interface Fields extends EditableFields {
    category: Category;
    chapterId: string | null;
    groupId: string | null;
    pinnedComment?: string | null;
  }

  export interface Create extends Fields, ContentMetadata.Create {}

  export interface Update
    extends Partial<EditableFields>,
      ContentMetadata.Update {
    topics?: string[];
  }

  export interface Response extends Fields, ContentMetadata.Response {
    chapterData?: Chapter.Summary | null;
    groupData?: Group.Summary | null;
    editors?: string[];
    editorsData?: Record<string, Profile.Get>;
    sites?: Link[];
  }

  export interface Get extends Omit<Fields, 'content'>, ContentMetadata.Get {
    chapterData?: Chapter.Summary | null;
    content: Node[];
    createdBy: Profile.Get;
    groupData?: Group.Summary | null;
    editors: Profile.Get[];
    editorsData: Record<string, Profile.Get>;
    id: string;
    sites: Link[];
  }

  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }

  export interface Index extends SearchIndex {
    category: Category;
    description: string;
    groupId: string | null;
    photo: string | null;
    title: string;
  }
}
