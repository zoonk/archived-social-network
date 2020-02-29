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

const firebaseWhere = jest.fn().mockReturnValue({
  get: firebaseCollection,
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
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
  delete: jest.fn(),
  // Return the value passed to these methods to make it easier to test.
  increment: jest.fn((value) => value),
  serverTimestamp: jest.fn().mockReturnValue('timestamp'),
};

firestore.Timestamp = {
  // Return the value passed to this method to make it easier to test.
  fromDate: jest.fn((value) => value),
};

export { initializeApp, firestore };
