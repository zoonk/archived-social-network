import { markdownToText } from '../markdown';

test('leave a md alone without markdown', () => {
  const md = 'Javascript Developers are the best.';
  expect(markdownToText(md)).toEqual(md);
});

test('strip out remaining markdown', () => {
  const md = '*Javascript* developers are the _best_.';
  const expected = 'Javascript developers are the best.';
  expect(markdownToText(md)).toEqual(expected);
});

test('leave non-matching markdown markdown', () => {
  const md = '*Javascript* developers* are the _best_.';
  const expected = 'Javascript developers* are the best.';
  expect(markdownToText(md)).toEqual(expected);
});

test('leave non-matching markdown, but strip empty anchors', () => {
  const md = '*Javascript* [developers]()* are the _best_.';
  const expected = 'Javascript developers* are the best.';
  expect(markdownToText(md)).toEqual(expected);
});

test('strip HTML', () => {
  const md = '<a href="https://zoonk.org">link</a> and a <p>text</p>';
  const expected = 'link and a text';
  expect(markdownToText(md)).toEqual(expected);
});

test('strip anchors', () => {
  const md =
    '*Javascript* [developers](https://engineering.condenast.io/)* are the _best_.';
  const expected = 'Javascript developers* are the best.';
  expect(markdownToText(md)).toEqual(expected);
});

test('strip anchors with spaces', () => {
  const md =
    '*Javascript* [developers]   (https://engineering.condenast.io/)* are the _best_.';
  const expected = 'Javascript developers* are the best.';
  expect(markdownToText(md)).toEqual(expected);
});

test('strip anchors with new line', () => {
  const md =
    '*Javascript* [developers]\n(https://engineering.condenast.io/)* are the _best_.';
  const expected = 'Javascript developers* are the best.';
  expect(markdownToText(md)).toEqual(expected);
});

test('strip img tags', () => {
  const md =
    '![](https://placebear.com/640/480)*Javascript* developers are the _best_.';
  const expected = 'Javascript developers are the best.';
  expect(markdownToText(md)).toEqual(expected);
});

test('strip code tags', () => {
  const md = 'In `Getting Started` we set up `something` foo.';
  const expected = 'In Getting Started we set up something foo.';
  expect(markdownToText(md)).toEqual(expected);
});

test('leave hashtags in headings', () => {
  const md = '## This #heading contains #hashtags';
  const expected = 'This #heading contains #hashtags';
  expect(markdownToText(md)).toEqual(expected);
});

test('remove emphasis', () => {
  const md = 'I italicized an *I* and it _made_ me *sad*.';
  const expected = 'I italicized an I and it made me sad.';
  expect(markdownToText(md)).toEqual(expected);
});

test('remove double emphasis', () => {
  const md = '**this sentence has __double styling__**';
  const expected = 'this sentence has double styling';
  expect(markdownToText(md)).toEqual(expected);
});

test('remove horizontal rules', () => {
  const md = 'Some text on a line\n\n---\n\nA line below';
  const expected = 'Some text on a line A line below';
  expect(markdownToText(md)).toEqual(expected);
});

test('remove horizontal rules with space-separated asterisks', () => {
  const md = 'Some text on a line\n\n* * *\n\nA line below';
  const expected = 'Some text on a line A line below';
  expect(markdownToText(md)).toEqual(expected);
});

test('remove blockquotes', () => {
  const md = '>I am a blockquote';
  const expected = 'I am a blockquote';
  expect(markdownToText(md)).toEqual(expected);
});

test('remove blockquotes with spaces', () => {
  const md = '> I am a blockquote';
  const expected = 'I am a blockquote';
  expect(markdownToText(md)).toEqual(expected);
});

test('remove indented blockquotes', () => {
  const tests = [
    { md: ' > I am a blockquote', expected: 'I am a blockquote' },
    { md: '  > I am a blockquote', expected: 'I am a blockquote' },
    { md: '   > I am a blockquote', expected: 'I am a blockquote' },
  ];
  tests.forEach((test) => {
    expect(markdownToText(test.md)).toEqual(test.expected);
  });
});

test('does not remove greater than signs', () => {
  const tests = [
    { md: '100 > 0', expected: '100 > 0' },
    { md: '100 >= 0', expected: '100 >= 0' },
    { md: '100>0', expected: '100>0' },
    { md: '> 100 > 0', expected: '100 > 0' },
    { md: '1 < 100', expected: '1 < 100' },
    { md: '1 <= 100', expected: '1 <= 100' },
  ];
  tests.forEach((test) => {
    expect(markdownToText(test.md)).toEqual(test.expected);
  });
});

test('remove custom templates', () => {
  const md = 'some text\n[[ youtube id="random-video" ]]\nmore text.';
  const expected = 'some text more text.';
  expect(markdownToText(md)).toEqual(expected);
});
