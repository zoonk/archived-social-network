export interface PostProgress {
  read?: boolean;
}

export namespace ChapterProgress {
  export interface Create {
    examples?: firebase.firestore.FieldValue;
    lessons?: firebase.firestore.FieldValue;
  }

  export interface Response {
    examples?: string[];
    lessons?: string[];
  }
}

export interface TopicProgress {
  [chapterId: string]: { examples: number; lessons: number; posts: number };
}

export namespace UserProgress {
  export interface Topic {
    progress: number;
  }
}
