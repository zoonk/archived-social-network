import functions from 'firebase-functions-test';

const testEnv = functions();
testEnv.mockConfig({ algolia: { app_id: 'app id', api_id: 'api id' } });

import { algoliaClient } from '../../../algolia';
import { onWriteTopicUpdateIndex } from '../updateIndex';

test('return if there are no changes', async (done) => {
  const before = {
    description: 'topic description',
    photo: 'topic.png',
    title: 'topic name',
  };
  const after = {
    description: 'topic description',
    language: 'en',
    updatedAt: 'today',
    updatedById: 'editorId',
    photo: 'topic.png',
    likes: 10,
    title: 'topic name',
  };
  const change = {
    before: { id: 'topicId', data: () => before },
    after: { id: 'topicId', data: () => after },
  };
  const wrapped = testEnv.wrap(onWriteTopicUpdateIndex);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(algoliaClient.initIndex('').deleteObject).not.toHaveBeenCalled();
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).not.toHaveBeenCalled();
  done();
});

test('delete the index when a topic is removed', async (done) => {
  spyOn(algoliaClient.initIndex(''), 'deleteObject').and.returnValue('deleted');

  const before = {
    description: 'topic description',
    language: 'en',
    photo: 'topic.png',
    title: 'topic name',
  };
  const change = {
    before: { id: 'topicId', data: () => before },
    after: { id: 'topicId', data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWriteTopicUpdateIndex);
  const req = await wrapped(change);

  expect(req).toBe('deleted');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('topics_en');
  expect(algoliaClient.initIndex('').deleteObject).toHaveBeenCalledWith(
    'topicId',
  );
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).not.toHaveBeenCalled();
  done();
});

test('update the index when a topic changes', async (done) => {
  spyOn(algoliaClient.initIndex(''), 'partialUpdateObject').and.returnValue(
    'updated',
  );

  const before = {
    description: 'topic description',
    photo: 'topic.png',
    title: 'topic name',
  };
  const after = {
    description: 'new topic description',
    language: 'en',
    updatedAt: 'today',
    updatedById: 'editorId',
    photo: 'topic.png',
    likes: 10,
    title: 'new topic name',
  };
  const expected = {
    description: 'new topic description',
    itemPath: 'topics/topicId',
    objectID: 'topicId',
    photo: 'topic.png',
    title: 'new topic name',
  };
  const change = {
    before: { id: 'topicId', data: () => before },
    after: { id: 'topicId', data: () => after },
  };
  const wrapped = testEnv.wrap(onWriteTopicUpdateIndex);
  const req = await wrapped(change);

  expect(req).toBe('updated');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('topics_en');
  expect(algoliaClient.initIndex('').deleteObject).not.toHaveBeenCalledWith(
    'topicId',
  );
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).toHaveBeenCalledWith(expected, { createIfNotExists: true });
  done();
});
