import cheerio from 'cheerio';
import fetch from 'node-fetch';
import url from 'url';
import { Post } from '@zoonk/models';

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

  let image = ogImage || appleIcon || shortcut || icon || null;

  if (image) {
    image = image.replace('http://', 'https://');
    image = url.resolve(pageAddress, image);
  }

  return {
    description: ogDesc || description || null,
    image,
    title: ogTitle || title || 'undefined',
    url: canonical || pageAddress,
  };
};
