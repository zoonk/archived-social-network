import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { Node } from 'slate';
import url from 'url';
import { Post } from '@zoonk/models';

const getDomain = (link: string) => {
  const { host } = new URL(link);
  return host.replace('www.', '');
};

export const getPlainText = (nodes: Node[]): string => {
  return nodes.map((n) => Node.string(n)).join('\n');
};

export const getMetadataFromUrl = async (link: string): Promise<Post.Link> => {
  const response = await fetch(link);
  const html = await response.text();
  const $ = cheerio.load(html);

  // Convert http to https
  const pageAddress = link.replace('http://', 'https://');

  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDesc = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const canonical = $('link[rel="canonical"]').attr('href');
  const shortcut = $('link[rel="shortcut icon"]').attr('href');
  const icon = $('link[rel="icon"]').attr('href');
  const appleIcon = $('link[rel="apple-touch-icon"]').attr('href');
  const pageUrl = canonical || pageAddress;
  const pageTitle = ogTitle || title || getDomain(pageUrl);

  let image = ogImage || appleIcon || shortcut || icon || null;

  if (image) {
    image = image.replace('http://', 'https://');
    image = url.resolve(pageAddress, image);
  }

  return {
    description: ogDesc || description || null,
    image,
    title: pageUrl.includes('.pdf') ? `${pageTitle} (PDF)` : pageTitle,
    url: url.resolve(pageAddress, pageUrl),
  };
};
