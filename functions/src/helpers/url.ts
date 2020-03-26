import cheerio from 'cheerio';
import fetch from 'isomorphic-unfetch';
import { Post } from '@zoonk/models';

export const getMetadataFromUrl = async (url: string): Promise<Post.Link> => {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDesc = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const canonical = $('link[rel="canonical"]').attr('href');
  const shortcut = $('link[rel="shortcut icon"]').attr('href');
  const icon = $('link[rel="icon"]').attr('href');
  const appleIcon = $('link[rel="apple-touch-icon"]').attr('href');

  return {
    description: description || ogDesc || null,
    image: ogImage || shortcut || icon || appleIcon || null,
    title: title || ogTitle || 'undefined',
    url: canonical || url,
  };
};
