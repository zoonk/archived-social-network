import functions from 'firebase-functions-test';

const testEnv = functions();
testEnv.mockConfig({ algolia: { app_id: 'app id', api_id: 'api id' } });

import { algoliaClient } from '../../../algolia';
import { onWritePostUpdateIndex } from '../updateIndex';

test('return if there are no changes', async (done) => {
  const context = { params: { id: 'itemId' } };
  const data = {
    content: 'content',
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
  const wrapped = testEnv.wrap(onWritePostUpdateIndex);
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
    content: 'content',
    language: 'pt',
    title: 'name',
  };
  const change = {
    before: { exists: true, data: () => before },
    after: { exists: false, data: () => undefined },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateIndex);
  const req = await wrapped(change, context);

  expect(req).toBe('deleted');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('posts_pt');
  expect(algoliaClient.initIndex('').deleteObject).toHaveBeenCalledWith(
    'itemId',
  );
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).not.toHaveBeenCalled();
  done();
});

test('update the index when the content changes', async (done) => {
  spyOn(algoliaClient.initIndex(''), 'partialUpdateObject').and.returnValue(
    'updated',
  );

  const context = { params: { id: 'itemId' } };
  const before = {
    content: 'old description',
    title: 'name',
  };
  const after = {
    category: 'examples',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non ipsum porttitor, aliquam eros nec, dictum ante. Aenean posuere orci sed risus mattis gravida. In eros ex, porta at tellus sed, posuere varius sapien. Maecenas et accumsan tellus. Praesent fermentum nisi sed nulla vulputate eleifend. Nam et porta enim. Donec lobortis non elit quis consequat. Nulla facilisis suscipit tellus, id tincidunt dolor consequat nec. Vestibulum in placerat enim. Ut eget diam nec diam aliquam mollis at eu velit. Proin ornare, dui sit amet iaculis consequat, ante mi dapibus neque, a efficitur risus lectus eget ante. Nulla pretium euismod varius. Cras auctor quis diam sit amet rutrum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum pellentesque, mauris nec euismod fermentum, purus risus interdum odio, eu sollicitudin nibh velit et enim. Nullam accumsan nisi sem, sit amet pharetra neque hendrerit id. Nulla suscipit urna dolor, at convallis diam sodales eget nullam sodales.',
    language: 'en',
    updatedById: 'editorId',
    likes: 10,
    topics: ['item 1', 'item 2'],
    title: 'name',
  };
  const expected = {
    category: 'examples',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non ipsum porttitor, aliquam eros nec, dictum ante. Aenean posuere orci sed risus mattis gravida. In eros ex, porta at tellus sed, posuere varius sapien. Maecenas et accumsan tellus. Praesent fermentum nisi sed nulla vulputate eleifend. Nam et porta enim. Donec lobortis non elit quis consequat. Nulla facilisis suscipit tellus, id tincidunt dolor consequat nec. Vestibulum in placerat enim. Ut eget diam nec diam aliquam mollis at e',
    itemPath: 'posts/itemId',
    objectID: 'itemId',
    photo: null,
    title: 'name',
  };
  const change = {
    before: { exists: true, data: () => before },
    after: { exists: true, data: () => after },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateIndex);
  const req = await wrapped(change, context);

  expect(req).toBe('updated');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('posts_en');
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
    content: 'content',
    title: 'name',
  };
  const after = {
    category: 'posts',
    content: 'content',
    language: 'en',
    updatedById: 'editorId',
    likes: 10,
    topics: ['item 1', 'item 2'],
    title: 'new name',
  };
  const expected = {
    category: 'posts',
    description: 'content',
    itemPath: 'posts/itemId',
    objectID: 'itemId',
    photo: null,
    title: 'new name',
  };
  const change = {
    before: { exists: true, data: () => before },
    after: { exists: true, data: () => after },
  };
  const wrapped = testEnv.wrap(onWritePostUpdateIndex);
  const req = await wrapped(change, context);

  expect(req).toBe('updated');
  expect(algoliaClient.initIndex).toHaveBeenCalledWith('posts_en');
  expect(algoliaClient.initIndex('').deleteObject).not.toHaveBeenCalledWith(
    'itemId',
  );
  expect(
    algoliaClient.initIndex('').partialUpdateObject,
  ).toHaveBeenCalledWith(expected, { createIfNotExists: true });
  done();
});
