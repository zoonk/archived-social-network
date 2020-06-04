const firebaseDoc = {
  delete: jest.fn(),
  get: jest.fn().mockReturnValue({
    data: jest.fn(),
  }),
  set: jest.fn(),
  update: jest.fn(),
};

const firebaseDocRef = jest.fn().mockReturnValue(firebaseDoc);

const firebaseCollection = jest.fn().mockReturnValue({
  docs: [],
});

const firebaseLimit = jest.fn().mockReturnValue({
  get: jest.fn(),
});

const firebaseOrderBy = jest.fn().mockReturnValue({
  limit: firebaseLimit,
  get: jest.fn(),
});

const firebaseWhere = jest.fn().mockReturnValue({
  get: firebaseCollection,
  orderBy: firebaseOrderBy,
  where: jest.fn(),
});

const firebaseCollectionRef = jest.fn().mockReturnValue({
  add: jest.fn(),
  doc: firebaseDocRef,
  get: firebaseCollection,
  listDocuments: jest.fn().mockReturnValue([firebaseDoc]),
  where: firebaseWhere,
});

const initializeApp = jest.fn();

const auth = jest.fn().mockReturnValue({
  setCustomUserClaims: jest.fn(),
  updateUser: jest.fn(),
});

const firestore: any = jest.fn().mockReturnValue({
  batch: jest.fn().mockReturnValue({
    commit: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
  }),
  collection: firebaseCollectionRef,
  collectionGroup: jest.fn().mockReturnValue({
    where: firebaseWhere,
  }),
  doc: firebaseDocRef,
});

firestore.FieldValue = {
  arrayUnion: jest.fn((value) => `added: ${value}`),
  arrayRemove: jest.fn((value) => `removed: ${value}`),
  delete: jest.fn().mockReturnValue('deleted'),
  // Return the value passed to these methods to make it easier to test.
  increment: jest.fn((value) => value),
  serverTimestamp: jest.fn().mockReturnValue('timestamp'),
};

firestore.Timestamp = {
  // Return the value passed to this method to make it easier to test.
  fromDate: jest.fn((value) => value),
};

export { auth, initializeApp, firestore };
