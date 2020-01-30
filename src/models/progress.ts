export interface PostProgress {
  completed: boolean;
}

export namespace ChapterProgress {
  export interface Create {
    examples: firebase.firestore.FieldValue;
    lessons: firebase.firestore.FieldValue;
    posts: firebase.firestore.FieldValue;
  }

  export interface Response {
    examples?: number;
    lessons?: number;
    posts?: number;
  }
}

export namespace PathProgress {
  export interface Create extends ChapterProgress.Create {}
  export interface Response extends ChapterProgress.Response {}
}
