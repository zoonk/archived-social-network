import functions from 'firebase-functions-test';

const testEnv = functions();
testEnv.mockConfig({ algolia: { app_id: 'app id', api_id: 'api id' } });

import { algoliaClient } from '../../../algolia';
import { onWriteChapterUpdateIndex } from '../updateIndex';

test('return if there are no changes', async (done) => {
  const context = { params: { id: 'itemId' } };
  const data = {
    description: 'description',
    title: 'topic name',
  };
  const after = {
    ...data,
    language: 'en',
    updatedById: 'editorId',
  };
  const change = {
    before: { exists: true, data: () => data },
    after: { exists: true, data: () => after },
  };
  const wrapped = testEnv.wrap(onWriteChapterUpdateIndex);
  const req = await wrapped(change, context);

  expect(req).toBe(false);
  expect(algoliaClient.initIndex('').deleteObject).not.toHaveBeenCalled();
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).not.toHaveBeenCalled();
  done();
});

test('delete the index when an item is removed', async (done) => {
  spyOn(algoliaClient.initIndex(''), 'deleteObject').and.returnValue('deleted');

  const context = { params: { id: 'itemId' } };
  const before = {
    description: 'description',
    language: 'pt',
    title: 'name',
  };
  const change = {
    before: { exists: true, data: () => before },
    after: { exists: false, data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWriteChapterUpdateIndex);
  const req = await wrapped(change, context);

  expect(req).toBe('deleted');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('chapters_pt');
  expect(algoliaClient.initIndex('').deleteObject).toHaveBeenCalledWith(
    'itemId',
  );
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).not.toHaveBeenCalled();
  done();
});

test('update the index when the description changes', async (done) => {
  spyOn(algoliaClient.initIndex(''), 'partialUpdateObject').and.returnValue(
    'updated',
  );

  const context = { params: { id: 'itemId' } };
  const before = {
    description: 'old description',
    title: 'name',
  };
  const after = {
    description: 'new description',
    language: 'en',
    updatedById: 'editorId',
    likes: 10,
    topics: ['item1', 'item2'],
    title: 'name',
  };
  const expected = {
    description: 'new description',
    itemPath: 'chapters/itemId',
    objectID: 'itemId',
    title: 'name',
    topics: ['item1', 'item2'],
  };
  const change = {
    before: { exists: true, data: () => before },
    after: { exists: true, data: () => after },
  };
  const wrapped = testEnv.wrap(onWriteChapterUpdateIndex);
  const req = await wrapped(change, context);

  expect(req).toBe('updated');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('chapters_en');
  expect(algoliaClient.initIndex('').deleteObject).not.toHaveBeenCalledWith(
    'itemId',
  );
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).toHaveBeenCalledWith(expected, { createIfNotExists: true });
  done();
});

test('update the index when the title changes', async (done) => {
  spyOn(algoliaClient.initIndex(''), 'partialUpdateObject').and.returnValue(
    'updated',
  );

  const context = { params: { id: 'itemId' } };
  const before = {
    description: 'description',
    title: 'name',
  };
  const after = {
    description: 'description',
    language: 'en',
    updatedById: 'editorId',
    likes: 10,
    topics: ['item1', 'item2'],
    title: 'new name',
  };
  const expected = {
    description: 'description',
    itemPath: 'chapters/itemId',
    objectID: 'itemId',
    title: 'new name',
    topics: ['item1', 'item2'],
  };
  const change = {
    before: { exists: true, data: () => before },
    after: { exists: true, data: () => after },
  };
  const wrapped = testEnv.wrap(onWriteChapterUpdateIndex);
  const req = await wrapped(change, context);

  expect(req).toBe('updated');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('chapters_en');
  expect(algoliaClient.initIndex('').deleteObject).not.toHaveBeenCalledWith(
    'itemId',
  );
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).toHaveBeenCalledWith(expected, { createIfNotExists: true });
  done();
});
