import { getChangedFields, getObjDiff } from '../diff';

describe('getChangedFields()', () => {
  it('should display all changed fields for an object', () => {
    const oldObj = {
      strSame: 'description',
      strChanged: 'old title',
      arrSame: ['notChanged'],
      arrChanged: ['topic1'],
      arrIndexChanged: ['old item'],
      objSame: { item1: 'same' },
      objChanged: { user1: 'not changed' },
      objKeyChanged: { item: 'old value' },
    };

    const newObj = {
      strSame: 'description',
      strChanged: 'new title',
      arrSame: ['notChanged'],
      arrChanged: ['topic1', 'topic2'],
      arrIndexChanged: ['new item'],
      objSame: { item1: 'same' },
      objChanged: { user1: 'not changed', user2: 'new user' },
      objKeyChanged: { item: 'new value' },
    };

    const expected = [
      'strChanged',
      'arrChanged',
      'arrIndexChanged',
      'objChanged',
      'objKeyChanged',
    ];
    expect(getChangedFields(oldObj, newObj)).toEqual(expected);
  });
});

describe('getObjDiff()', () => {
  it('should display changed fields for strings', () => {
    const before = {
      description: 'desc',
      title: 'old title',
    };

    const after = {
      description: 'desc',
      title: 'new title',
    };

    const expected = {
      before: [{ field: 'title', value: 'old title' }],
      after: [{ field: 'title', value: 'new title' }],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should display only changed sentences for strings', () => {
    const before = {
      description:
        'This sentence is the same. This sentence is old. This sentence did not change.',
    };

    const after = {
      description:
        'This sentence is the same. This sentence is new. This sentence did not change.',
    };

    const expected = {
      before: [{ field: 'description', value: 'This sentence is old.' }],
      after: [{ field: 'description', value: 'This sentence is new.' }],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should display multiple changed sentences', () => {
    const before = {
      description: 'This is old. This is the same. This is also old.',
    };

    const after = {
      description: 'This is new. This is the same. This is also new.',
    };

    const expected = {
      before: [
        { field: 'description', value: 'This is old. [...] This is also old.' },
      ],
      after: [
        { field: 'description', value: 'This is new. [...] This is also new.' },
      ],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should display changed fields for numbers', () => {
    const before = {
      age: 27,
      size: 0,
    };

    const after = {
      age: 27,
      size: 10,
    };

    const expected = {
      before: [{ field: 'size', value: '0' }],
      after: [{ field: 'size', value: '10' }],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should display changed fields for booleans', () => {
    const before = {
      isPublished: false,
    };

    const after = {
      isPublished: true,
    };

    const expected = {
      before: [{ field: 'isPublished', value: 'false' }],
      after: [{ field: 'isPublished', value: 'true' }],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should display changed fields for nested objects', () => {
    const before = {
      subjects: {
        arts: true,
      },
      skills: {
        empathy: 'nochanges',
      },
    };

    const after = {
      subjects: {
        arts: true,
        history: true,
      },
      skills: {
        empathy: 'nochanges',
      },
    };

    const expected = {
      before: [],
      after: [{ field: 'history', value: 'true' }],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should display changed fields for multiple nested objects', () => {
    const before = {
      subjects: {
        arts: true,
      },
    };

    const after = {
      subjects: {
        arts: true,
        history: true,
      },
      skills: {
        curiosity: true,
        empathy: true,
      },
    };

    const expected = {
      before: [],
      after: [
        { field: 'history', value: 'true' },
        { field: 'curiosity', value: 'true' },
        { field: 'empathy', value: 'true' },
      ],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should display changed fields for arrays containing objects', () => {
    const before = {
      messages: [
        { img: null, message: 'message 1' },
        { img: null, message: 'old msg' },
      ],
    };

    const after = {
      messages: [
        { img: null, message: 'message 1' },
        { img: null, message: 'message 2' },
        { img: 'img.png', message: null },
        { img: 'img2.svg', message: 'message 3' },
      ],
    };

    const expected = {
      before: [{ field: 'message', value: 'old msg' }],
      after: [
        { field: 'message', value: 'message 2' },
        { field: 'img', value: 'img.png' },
        { field: 'message', value: 'null' },
        { field: 'img', value: 'img2.svg' },
        { field: 'message', value: 'message 3' },
      ],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should display changed fields for multiple arrays', () => {
    const before = {};

    const after = {
      characters: [{ name: 'da vinci' }],
      messages: [{ message: 'message 1' }],
    };

    const expected = {
      before: [],
      after: [
        { field: 'name', value: 'da vinci' },
        { field: 'message', value: 'message 1' },
      ],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should display changed fields for arrays containg strings or numbers', () => {
    const before = {};

    const after = {
      messages: ['msg 1', 'msg 2'],
      ratings: [4, 2],
    };

    const expected = {
      before: [],
      after: [
        { field: 'messages', value: 'msg 1' },
        { field: 'messages', value: 'msg 2' },
        { field: 'ratings', value: '4' },
        { field: 'ratings', value: '2' },
      ],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should display changed fields for arrays in the before object', () => {
    const before = {
      messages: ['msg1', 'old msg', 'msg3'],
      ratings: [4, 2, 3],
    };

    const after = {
      messages: ['msg1', 'msg 2', 'msg3'],
      ratings: [4, 3, 3],
    };

    const expected = {
      before: [
        { field: 'messages', value: 'old msg' },
        { field: 'ratings', value: '2' },
      ],
      after: [
        { field: 'messages', value: 'msg 2' },
        { field: 'ratings', value: '3' },
      ],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should not display changes when an array is the same', () => {
    const before = {
      messages: [{ img: null, message: 'message 1' }],
    };

    const after = {
      messages: [{ img: null, message: 'message 1' }],
    };

    const expected = {
      before: [],
      after: [],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should handle cases where a field is undefined', () => {
    const before = {
      description: 'nochanges',
    };

    const after = {
      description: 'nochanges',
      title: 'new title',
    };

    const expected = {
      before: [],
      after: [{ field: 'title', value: 'new title' }],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should handle cases where a nested field is undefined', () => {
    const before = {
      description: 'nochanges',
    };

    const after = {
      description: 'nochanges',
      subjects: {
        arts: true,
      },
    };

    const expected = {
      before: [],
      after: [{ field: 'arts', value: 'true' }],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should handle cases where the previous document is falsy', () => {
    const before = null;

    const after = {
      description: 'desc',
      subjects: {
        arts: true,
      },
    };

    const expected = {
      before: [],
      after: [
        { field: 'description', value: 'desc' },
        { field: 'arts', value: 'true' },
      ],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });

  it('should handle cases where a the newest document is falsy', () => {
    const before = {
      description: 'desc',
      subjects: {
        arts: true,
      },
    };

    const after = null;

    const expected = {
      after: [],
      before: [
        { field: 'description', value: 'desc' },
        { field: 'arts', value: 'true' },
      ],
    };

    expect(getObjDiff(before, after)).toEqual(expected);
  });
});
