import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
const db = admin.firestore();

import { onWritePostUpdateChapters } from '../updateChapters';

test('return when a post does not belong to a chapter', async (done) => {
  const before = { data: () => ({ chapterId: null }) };
  const after = { data: () => ({ chapterId: null }) };
  const change = { before, after };
  const wrapped = testEnv.wrap(onWritePostUpdateChapters);
  const req = await wrapped(change);
  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('return when there are no changes to a lesson', async (done) => {
  const post = {
    chapterId: 'valid',
    title: 'title',
    html: 'description',
  };
  const before = { data: () => post };
  const after = { data: () => ({ ...post, likes: 10 }) };
  const change = { before, after };
  const wrapped = testEnv.wrap(onWritePostUpdateChapters);
  const req = await wrapped(change);
  expect(req).toBe(false);
  expect(db.doc).not.toHaveBeenCalled();
  done();
});

test('add a lesson to a chapter', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const post = {
    title: 'title',
    html: '<h1>title</h1><p>text.</p>',
    cover: 'photo.png',
    category: 'lessons',
  };
  const params = { id: 'lessonId' };
  const before = { data: () => ({ ...post, chapterId: null }) };
  const after = { data: () => ({ ...post, chapterId: 'chapterId' }) };
  const change = { before, after };
  const wrapped = testEnv.wrap(onWritePostUpdateChapters);
  const req = await wrapped(change, { params });
  const changes = {
    'lessonData.lessonId': {
      cover: 'photo.png',
      description: 'title text.',
      title: 'title',
      id: 'lessonId',
    },
    lessons: 'added: lessonId',
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId');
  expect(db.doc('').update).toHaveBeenCalledWith(changes);
  done();
});

test('add an example to a chapter', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const post = {
    title: 'title',
    html: '<h1>title</h1><p>text.</p>',
    cover: 'photo.png',
    category: 'examples',
  };
  const params = { id: 'exampleId' };
  const before = { data: () => ({ ...post, chapterId: null }) };
  const after = { data: () => ({ ...post, chapterId: 'chapterId' }) };
  const change = { before, after };
  const wrapped = testEnv.wrap(onWritePostUpdateChapters);
  const req = await wrapped(change, { params });
  const changes = {
    'exampleData.exampleId': {
      cover: 'photo.png',
      description: 'title text.',
      title: 'title',
      id: 'exampleId',
    },
    examples: 'added: exampleId',
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId');
  expect(db.doc('').update).toHaveBeenCalledWith(changes);
  done();
});

test('remove a lesson to a chapter', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const post = {
    title: 'title',
    html: '<h1>title</h1><p>text.</p>',
    category: 'lessons',
  };
  const params = { id: 'lessonId' };
  const before = { data: () => ({ ...post, chapterId: 'chapterId' }) };
  const after = { data: () => ({ ...post, chapterId: null }) };
  const change = { before, after };
  const wrapped = testEnv.wrap(onWritePostUpdateChapters);
  const req = await wrapped(change, { params });
  const changes = {
    'lessonData.lessonId': 'deleted',
    lessons: 'removed: lessonId',
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId');
  expect(db.doc('').update).toHaveBeenCalledWith(changes);
  done();
});

test('remove an example to a chapter', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const post = {
    title: 'title',
    html: 'description',
    category: 'examples',
  };
  const params = { id: 'exampleId' };
  const before = { data: () => ({ ...post, chapterId: 'chapterId' }) };
  const after = { data: () => ({ ...post, chapterId: null }) };
  const change = { before, after };
  const wrapped = testEnv.wrap(onWritePostUpdateChapters);
  const req = await wrapped(change, { params });
  const changes = {
    'exampleData.exampleId': 'deleted',
    examples: 'removed: exampleId',
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId');
  expect(db.doc('').update).toHaveBeenCalledWith(changes);
  done();
});

test('update a lesson from a chapter', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const post = { category: 'lessons', chapterId: 'chapterId' };
  const oldPost = { title: 'title', html: 'description' };
  const newPost = {
    title: 'new title',
    html: '<h1>title</h1><p>text.</p>',
    cover: 'photo.png',
  };
  const params = { id: 'lessonId' };
  const before = { data: () => ({ ...post, ...oldPost }) };
  const after = { data: () => ({ ...post, ...newPost }) };
  const change = { before, after };
  const wrapped = testEnv.wrap(onWritePostUpdateChapters);
  const req = await wrapped(change, { params });
  const changes = {
    'lessonData.lessonId': {
      title: 'new title',
      cover: 'photo.png',
      description: 'title text.',
      id: 'lessonId',
    },
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId');
  expect(db.doc('').update).toHaveBeenCalledWith(changes);
  done();
});

test('update an example from a chapter', async (done) => {
  spyOn(db.doc(''), 'update').and.returnValue('updated');

  const post = { category: 'examples', chapterId: 'chapterId' };
  const oldPost = { title: 'title', html: 'description' };
  const newPost = {
    title: 'new title',
    html: '<h1>title</h1><p>text.</p>',
    cover: 'photo.png',
  };
  const params = { id: 'exampleId' };
  const before = { data: () => ({ ...post, ...oldPost }) };
  const after = { data: () => ({ ...post, ...newPost }) };
  const change = { before, after };
  const wrapped = testEnv.wrap(onWritePostUpdateChapters);
  const req = await wrapped(change, { params });
  const changes = {
    'exampleData.exampleId': {
      title: 'new title',
      cover: 'photo.png',
      description: 'title text.',
      id: 'exampleId',
    },
  };

  expect(req).toBe('updated');
  expect(db.doc).toHaveBeenCalledWith('chapters/chapterId');
  expect(db.doc('').update).toHaveBeenCalledWith(changes);
  done();
});
