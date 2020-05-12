import functions from 'firebase-functions-test';

const testEnv = functions();
testEnv.mockConfig({ algolia: { app_id: 'app id', api_id: 'api id' } });

import { algoliaClient } from '../../../algolia';
import { onWriteGroupUpdateIndex } from '../updateIndex';

test('return if there are no changes', async (done) => {
  const data = {
    description: 'old',
    photo: 'old.png',
    title: 'name',
  };
  const change = {
    before: { data: () => data },
    after: { data: () => ({ ...data, followers: 100 }) },
  };
  const wrapped = testEnv.wrap(onWriteGroupUpdateIndex);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(algoliaClient.initIndex('').deleteObject).not.toHaveBeenCalled();
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).not.toHaveBeenCalled();
  done();
});

test('delete the index when an item is removed', async (done) => {
  spyOn(algoliaClient.initIndex(''), 'deleteObject').and.returnValue('deleted');

  const before = {
    description: 'old',
    language: 'en',
    photo: 'photo.png',
    title: 'name',
  };
  const change = {
    before: { id: 'itemId', data: () => before },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWriteGroupUpdateIndex);
  const req = await wrapped(change);

  expect(req).toBe('deleted');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('groups_en');
  expect(algoliaClient.initIndex('').deleteObject).toHaveBeenCalledWith(
    'itemId',
  );
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).not.toHaveBeenCalled();
  done();
});

test('update the index when an item changes', async (done) => {
  spyOn(algoliaClient.initIndex(''), 'partialUpdateObject').and.returnValue(
    'updated',
  );

  const before = {
    description: 'old',
    photo: 'old.png',
    title: 'old name',
  };
  const after = {
    description: 'new',
    language: 'en',
    photo: 'new.png',
    title: 'new name',
  };
  const change = {
    before: { id: 'itemId', data: () => before },
    after: { id: 'itemId', data: () => after },
  };
  const wrapped = testEnv.wrap(onWriteGroupUpdateIndex);
  const req = await wrapped(change);
  const payload = {
    description: 'new',
    itemPath: 'groups/itemId',
    objectID: 'itemId',
    photo: 'new.png',
    title: 'new name',
  };

  expect(req).toBe('updated');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('groups_en');
  expect(algoliaClient.initIndex('').deleteObject).not.toHaveBeenCalledWith(
    'itemId',
  );
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).toHaveBeenCalledWith(payload, { createIfNotExists: true });
  done();
});
