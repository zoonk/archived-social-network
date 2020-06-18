import functions from 'firebase-functions-test';

const testEnv = functions();
testEnv.mockConfig({ algolia: { app_id: 'app id', api_id: 'api id' } });

import { algoliaClient } from '../../../algolia';
import { onWritePostUpdateIndex } from '../updateIndex';

const { initIndex } = algoliaClient;

test('return if there are no changes', async (done) => {
  const data = { content: 'content', title: 'name' };
  const change = {
    before: { data: () => data },
    after: { data: () => ({ ...data, updatedAt: 'now' }) },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateIndex);
  const req = await wrapped(change);

  expect(req).toBe(false);
  expect(initIndex('').deleteObject).not.toHaveBeenCalled();
  expect(initIndex('').partialUpdateObject).not.toHaveBeenCalled();
  done();
});

test('delete the index when an item is removed', async (done) => {
  spyOn(initIndex(''), 'deleteObject').and.returnValue('deleted');

  const params = { id: 'itemId' };
  const data = { content: 'content', language: 'pt', title: 'name' };
  const change = {
    before: { data: () => data },
    after: { data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateIndex);
  const req = await wrapped(change, { params });

  expect(req).toBe('deleted');
  expect(initIndex).toHaveBeenCalledWith('posts_pt');
  expect(initIndex('').deleteObject).toHaveBeenCalledWith('itemId');
  expect(initIndex('').partialUpdateObject).not.toHaveBeenCalled();
  done();
});

test('update the index when the category changes', async (done) => {
  spyOn(initIndex(''), 'partialUpdateObject').and.returnValue('updated');

  const params = { id: 'itemId' };
  const data = {
    content:
      '[{ "type": "paragraph", "children": [{ "text": "title text." }] }]',
    cover: null,
    groupId: 'groupId',
    language: 'en',
    title: 'name',
  };
  const before = { ...data, category: 'examples' };
  const after = { ...data, category: 'books' };
  const change = {
    before: { data: () => before },
    after: { data: () => after },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateIndex);
  const req = await wrapped(change, { params });
  const payload = {
    itemPath: 'posts/itemId',
    objectID: 'itemId',
    title: 'name',
    category: 'books',
    description: 'title text.',
    groupId: 'groupId',
    photo: null,
  };

  expect(req).toBe('updated');
  expect(initIndex).toHaveBeenCalledWith('posts_en');
  expect(initIndex('').deleteObject).not.toHaveBeenCalledWith();
  expect(initIndex('').partialUpdateObject).toHaveBeenCalledWith(payload, {
    createIfNotExists: true,
  });
  done();
});

test('update the index when the content changes', async (done) => {
  spyOn(initIndex(''), 'partialUpdateObject').and.returnValue('updated');

  const params = { id: 'itemId' };
  const data = {
    category: 'examples',
    cover: 'pic',
    groupId: null,
    language: 'pt',
    title: 'name',
  };
  const before = { ...data, content: 'old' };
  const after = {
    ...data,
    content: '[{ "type": "paragraph", "children": [{ "text": "new text." }] }]',
  };
  const change = {
    before: { data: () => before },
    after: { data: () => after },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateIndex);
  const req = await wrapped(change, { params });
  const payload = {
    itemPath: 'posts/itemId',
    objectID: 'itemId',
    title: 'name',
    category: 'examples',
    description: 'new text.',
    groupId: null,
    photo: 'pic',
  };

  expect(req).toBe('updated');
  expect(initIndex).toHaveBeenCalledWith('posts_pt');
  expect(initIndex('').deleteObject).not.toHaveBeenCalledWith();
  expect(initIndex('').partialUpdateObject).toHaveBeenCalledWith(payload, {
    createIfNotExists: true,
  });
  done();
});

test('update the index when the cover changes', async (done) => {
  spyOn(initIndex(''), 'partialUpdateObject').and.returnValue('updated');

  const params = { id: 'itemId' };
  const data = {
    category: 'examples',
    content:
      '[{ "type": "paragraph", "children": [{ "text": "title text." }] }]',
    groupId: null,
    language: 'es',
    title: 'name',
  };
  const before = { ...data, cover: null };
  const after = { ...data, cover: 'new' };
  const change = {
    before: { data: () => before },
    after: { data: () => after },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateIndex);
  const req = await wrapped(change, { params });
  const payload = {
    itemPath: 'posts/itemId',
    objectID: 'itemId',
    title: 'name',
    category: 'examples',
    description: 'title text.',
    groupId: null,
    photo: 'new',
  };

  expect(req).toBe('updated');
  expect(initIndex).toHaveBeenCalledWith('posts_es');
  expect(initIndex('').deleteObject).not.toHaveBeenCalledWith();
  expect(initIndex('').partialUpdateObject).toHaveBeenCalledWith(payload, {
    createIfNotExists: true,
  });
  done();
});

test('update the index when the title changes', async (done) => {
  spyOn(initIndex(''), 'partialUpdateObject').and.returnValue('updated');

  const params = { id: 'itemId' };
  const data = {
    category: 'courses',
    content:
      '[{ "type": "paragraph", "children": [{ "text": "title text." }] }]',
    cover: null,
    groupId: null,
    language: 'en',
  };
  const before = { ...data, title: 'old' };
  const after = { ...data, title: 'new' };
  const change = {
    before: { data: () => before },
    after: { data: () => after },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateIndex);
  const req = await wrapped(change, { params });
  const payload = {
    itemPath: 'posts/itemId',
    objectID: 'itemId',
    title: 'new',
    category: 'courses',
    description: 'title text.',
    groupId: null,
    photo: null,
  };

  expect(req).toBe('updated');
  expect(initIndex).toHaveBeenCalledWith('posts_en');
  expect(initIndex('').deleteObject).not.toHaveBeenCalledWith();
  expect(initIndex('').partialUpdateObject).toHaveBeenCalledWith(payload, {
    createIfNotExists: true,
  });
  done();
});
