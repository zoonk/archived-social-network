import { Activity } from './activity';
import { Chapter } from './chapter';
import { Comment } from './comments';
import { Post } from './post';
import { Profile } from './profile';
import { Topic } from './topic';
import { UILanguage } from './i18n';

export type ExpertLevel = 'beginner' | 'advanced' | 'pro' | 'expert';

/**
 * Metadata available for all items.
 */
export namespace ContentMetadata {
  /**
   * Required properties for updating the content metadata.
   */
  export interface Update {
    updatedAt: firebase.firestore.FieldValue;
    updatedBy: Profile.Response;
    updatedById: string;
  }

  /**
   * Required properties for creating the the content metadata.
   */
  export interface Create extends Update {
    comments: number;
    createdAt: firebase.firestore.FieldValue;
    createdBy: Profile.Get;
    createdById: string;
    language: UILanguage;
    likes: number;

    // We need the topics field for every action to update the leaderboard.
    topics: string[];
  }

  /**
   * Raw response coming from the backend.
   */
  export interface Response extends Omit<Create, 'createdAt' | 'updatedAt'> {
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
  }

  export interface ResponseEditable {}

  /**
   * Serialized metadata.
   */
  export interface Get extends Omit<Response, 'createdAt' | 'updatedAt'> {
    createdAt: string;
    updatedAt: string;
  }

  /**
   * Keep Firebase snapshot
   */
  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }
}

/**
 * All possible types of content.
 */
export type ContentTypes =
  | Activity.Response
  | Chapter.Response
  | Comment.Response
  | Post.Response
  | Topic.Response;

/**
 * Content with editable order.
 */
export type EditableOrder = 'chapters' | 'examples' | 'lessons';
