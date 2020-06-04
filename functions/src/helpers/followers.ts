import { Follower } from '@zoonk/models';

export const getField = (collection: Follower.Collections): string => {
  switch (collection) {
    case 'groups':
      return 'groupId';
    default:
      return 'topics';
  }
};

export const getOperator = (
  collection: Follower.Collections,
): firebase.firestore.WhereFilterOp => {
  switch (collection) {
    case 'groups':
      return '==';
    default:
      return 'array-contains';
  }
};
