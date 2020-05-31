jest.mock('node-fetch');

import nodeFetch from 'node-fetch';
import { getMetadataFromUrl } from '../url';

const { Response } = jest.requireActual('node-fetch');
const fetch = nodeFetch as jest.MockedFunction<typeof nodeFetch>;

test('return the metadata from a page', async (done) => {
  const html = `
    <html>
      <head>
        <title>SEO title</title>
        <meta name="description" content="SEO description />
        <link rel="icon" href="https://zoonk.org/icon.png" />
        <link rel="shortcut icon" href="https://zoonk.org/shortcut.png" />
        <link rel="apple-touch-icon" href="https://zoonk.org/ios.png" />
        <meta property="og:title" content="Zoonk" />
        <meta property="og:description" content="OG description" />
        <meta property="og:image" content="https://zoonk.org/test.png" />
        <link rel="canonical" href="https://canonical.zoonk.org" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: 'OG description',
    image: 'https://zoonk.org/test.png',
    title: 'Zoonk',
    url: 'https://canonical.zoonk.org/',
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('replace http with https for an image URL', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <meta property="og:image" content="http://zoonk.org/test.png" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: 'https://zoonk.org/test.png',
    title: 'Zoonk',
    url,
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('use description tag when open-graph tag is falsy', async (done) => {
  const html = `
    <html>
      <head>
        <meta name="description" content="meta description" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: 'meta description',
    image: null,
    title: 'zoonk.org',
    url,
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('use title tag when open-graph tag is falsy', async (done) => {
  const html = `
    <html>
      <head>
        <title>Title tag</title>
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: null,
    title: 'Title tag',
    url,
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('return the url when there is no canonical link', async (done) => {
  const html = `
    <html>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://www.zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: null,
    title: 'zoonk.org',
    url,
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('use appleIcon when the open-graph is falsy', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <link rel="apple-touch-icon" href="http://zoonk.org/iOS.png" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: 'https://zoonk.org/iOS.png',
    title: 'Zoonk',
    url,
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('use shortcut when open-graph and appleIcon are falsy', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <link rel="shortcut icon" href="http://zoonk.org/shortcut.png" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: 'https://zoonk.org/shortcut.png',
    title: 'Zoonk',
    url,
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('use icon when open-graph, appleIcon, and shortcut are falsy', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <link rel="icon" href="http://zoonk.org/icon.png" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: 'https://zoonk.org/icon.png',
    title: 'Zoonk',
    url,
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('add the domain name when the shortcut starts with /', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <link rel="shortcut icon" href="/shortcut.png" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'http://zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: 'https://zoonk.org/shortcut.png',
    title: 'Zoonk',
    url: 'https://zoonk.org/',
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('add the domain name when the appleIcon starts with /', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <link rel="apple-touch-icon" href="/ios.png" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'http://zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: 'https://zoonk.org/ios.png',
    title: 'Zoonk',
    url: 'https://zoonk.org/',
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('add the domain name when the icon starts with /', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <link rel="icon" href="/icon.png" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'http://zoonk.org/';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: 'https://zoonk.org/icon.png',
    title: 'Zoonk',
    url: 'https://zoonk.org/',
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('resolve shortcut relative path', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <link rel="shortcut icon" href="../../assets/shortcut.png" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/path1/path2';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: 'https://zoonk.org/assets/shortcut.png',
    title: 'Zoonk',
    url,
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('resolve relative path for appleIcon', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <link rel="apple-touch-icon" href="../../assets/ios.png" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/path1/path2';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: 'https://zoonk.org/assets/ios.png',
    title: 'Zoonk',
    url,
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('resolve relative path for icon', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <link rel="icon" href="../../assets/icon.png" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/path1/path2';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: 'https://zoonk.org/assets/icon.png',
    title: 'Zoonk',
    url,
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});

test('resolve relative path a canonical URL', async (done) => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="Zoonk" />
        <link rel="canonical" href="/test-url" />
      </head>
    </html>
  `;

  fetch.mockReturnValue(Promise.resolve(new Response(html)));

  const url = 'https://zoonk.org/path1/path2';
  const request = await getMetadataFromUrl(url);
  const response = {
    description: null,
    image: null,
    title: 'Zoonk',
    url: 'https://zoonk.org/test-url',
  };

  expect(request).toEqual(response);
  expect(fetch).toHaveBeenCalledWith(url);
  done();
});
