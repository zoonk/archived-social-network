import { getPlainText, getPostImage, getPostLinks } from '../posts';

describe('getPostImage()', () => {
  test('return URL for image tags', () => {
    const post = [
      {
        type: 'blockquote',
        children: [{ text: 'A wise quote.' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'A closing paragraph!' }],
      },
      {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { text: 'A nested item with a ' },
              {
                type: 'image',
                src: 'https://zoonk.org/photo1.png',
                children: [{ text: '' }],
              },
              { text: ' in it.' },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'An opening paragraph with a ' },
          {
            type: 'image',
            src: 'https://zoonk.org/photo2.png',
            children: [{ text: '' }],
          },
          { text: ' in it.' },
        ],
      },
    ];
    expect(getPostImage(post)).toEqual('https://zoonk.org/photo1.png');
  });

  test('return null when there are no images', () => {
    const post = [
      {
        type: 'paragraph',
        children: [{ text: 'An opening paragraph...' }],
      },
      {
        type: 'quote',
        children: [{ text: 'A wise quote.' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'A closing paragraph!' }],
      },
    ];
    expect(getPostImage(post)).toEqual(null);
  });
});

describe('getPlainText()', () => {
  test('convert HTML to plain text', () => {
    const post = [
      {
        type: 'paragraph',
        children: [{ text: 'An opening paragraph...' }],
      },
      {
        type: 'quote',
        children: [{ text: 'A wise quote.' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'A closing paragraph!' }],
      },
    ];
    const text = 'An opening paragraph...\nA wise quote.\nA closing paragraph!';
    expect(getPlainText(post)).toEqual(text);
  });
});

describe('getPostLinks', () => {
  test('return all unique links from a post', () => {
    const post = [
      {
        type: 'paragraph',
        children: [
          { text: 'An opening paragraph with a ' },
          {
            type: 'link',
            url: 'https://zoonk.org',
            children: [{ text: 'link' }],
          },
          { text: ' in it.' },
        ],
      },
      {
        type: 'blockquote',
        children: [{ text: 'A wise quote.' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'A closing paragraph!' }],
      },
      {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { text: 'A nested item with a ' },
              {
                type: 'link',
                url: '/test',
                children: [{ text: 'link' }],
              },
              { text: ' in it.' },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'Now we have the same ' },
          {
            type: 'link',
            url: 'https://zoonk.org',
            children: [{ text: 'link' }],
          },
          { text: ', which should be deleted.' },
        ],
      },
    ];
    const links = ['https://zoonk.org', 'https://en.zoonk.org/test'];

    expect(getPostLinks(post)).toEqual(links);
  });
});
