export interface ListParams {
  createdById?: string;
  lastVisible?: firebase.firestore.DocumentSnapshot;
  limit?: number;
  topicId?: string;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
