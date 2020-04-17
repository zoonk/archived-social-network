import { getPostImage } from '../posts';

describe('getPostImage()', () => {
  test('return the URL for a png', () => {
    const content = 'some random post and a photo ![test](test.png) here.';
    expect(getPostImage(content)).toEqual('test.png');
  });

  test('return the URL for a jpg', () => {
    const content = 'some random post and a photo ![test](test.jpg) here.';
    expect(getPostImage(content)).toEqual('test.jpg');
  });

  test('return the URL for a gif', () => {
    const content = 'some random post and a photo ![test](test.gif) here.';
    expect(getPostImage(content)).toEqual('test.gif');
  });

  test('return the URL for a svg', () => {
    const content = 'some random post and a photo ![test](test.svg) here.';
    expect(getPostImage(content)).toEqual('test.svg');
  });

  test('return full URL - including characters after extension', () => {
    const content = 'some with a photo ![test](test.png?size=400) here.';
    expect(getPostImage(content)).toEqual('test.png?size=400');
  });

  test('return correct URL when there is an alt tag', () => {
    const content = 'some with a photo ![test](test.png?size=400 "test") here.';
    expect(getPostImage(content)).toEqual('test.png?size=400');
  });

  test('return first URL when there are multiple images', () => {
    const content = 'test: ![test](test1.png) and ![test](test2.png?size=400).';
    expect(getPostImage(content)).toEqual('test1.png');
  });

  test('return null when there are no images', () => {
    const content = 'test: [test](test.html).';
    expect(getPostImage(content)).toEqual(null);
  });

  test('return URL for custom image tags', () => {
    const content = 'test: [[ img src="photo.png?size=400" ]].';
    expect(getPostImage(content)).toEqual('photo.png?size=400');
  });
});
