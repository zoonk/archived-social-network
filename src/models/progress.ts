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
