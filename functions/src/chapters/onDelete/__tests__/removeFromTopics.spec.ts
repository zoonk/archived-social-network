import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onDeleteChapterRemoveFromTopics } from '../removeFromTopics';

test('send a request to remove a chapter from all topics', async (done) => {
  spyOn(Promise, 'all').and.returnValue('removed');
  spyOn(db.collection('').where('', '==', ''), 'get').and.returnValue({
    docs: [
      { id: '1', ref: { update: jest.fn().mockReturnValue('ref1') } },
      { id: '2', ref: { update: jest.fn().mockReturnValue('ref2') } },
    ],
  });

  const arraySpy = spyOn(
    admin.firestore.FieldValue,
    'arrayRemove',
  ).and.returnValue('arrayRemove');
  const spy1 = (
    await db
      .collection('')
      .where('', '==', '')
      .get()
  ).docs[0].ref.update;
  const spy2 = (
    await db
      .collection('')
      .where('', '==', '')
      .get()
  ).docs[1].ref.update;

  const snap = { id: 'chapterId' };
  const wrapped = testEnv.wrap(onDeleteChapterRemoveFromTopics);
  const req = await wrapped(snap);
  const chapters = 'arrayRemove';

  expect(req).toBe('removed');
  expect(db.collection).toHaveBeenCalledWith('topics');
  expect(db.collection('').where).toHaveBeenCalledWith(
    'chapters',
    'array-contains',
    'chapterId',
  );
  expect(spy1).toHaveBeenCalledWith({ chapters });
  expect(spy2).toHaveBeenCalledWith({ chapters });
  expect(arraySpy).toHaveBeenCalledWith('chapterId');
  expect(arraySpy).toHaveBeenCalledTimes(2);
  expect(Promise.all).toHaveBeenCalledWith(['ref1', 'ref2']);
  done();
});
