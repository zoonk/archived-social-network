import { getPlainText, getPostImage } from '../posts';

describe('getPostImage()', () => {
  test('return URL for image tags', () => {
    const content =
      '<p>test</p><p><img src="photo.png?size=400" alt="test" /></p>';
    expect(getPostImage(content)).toEqual('photo.png?size=400');
  });

  test('return null when there are no images', () => {
    const content = '<p>test</p><p><iframe src="video.mp4" /></p>';
    expect(getPostImage(content)).toEqual(null);
  });
});

describe('getPlainText()', () => {
  test('convert HTML to plain text', () => {
    const html =
      '<h1>title</h1><p>text with a <a href="test.com">link</a><img src="photo.png" alt="photo" title="photo" /> for testing.</p>';
    const text = 'title text with a link for testing.';
    expect(getPlainText(html)).toEqual(text);
  });
});
