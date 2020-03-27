import cheerio from 'cheerio';
import fetch from 'isomorphic-unfetch';
import { Post } from '@zoonk/models';

export const getMetadataFromUrl = async (url: string): Promise<Post.Link> => {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove trailling slash (/) from URL
  const link = url.replace(/\/+$/, '');
  let domain = link;
  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDesc = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const canonical = $('link[rel="canonical"]').attr('href');
  let shortcut = $('link[rel="shortcut icon"]').attr('href');
  let icon = $('link[rel="icon"]').attr('href');
  let appleIcon = $('link[rel="apple-touch-icon"]').attr('href');

  try {
    domain = new URL(link).host;
  } catch (e) {
    domain = link;
  }

  if (shortcut?.startsWith('/')) {
    shortcut = domain + shortcut;
  }

  if (icon?.startsWith('/')) {
    icon = domain + icon;
  }

  if (appleIcon?.startsWith('/')) {
    appleIcon = domain + appleIcon;
  }

  const image = ogImage || appleIcon || shortcut || icon;

  return {
    description: description || ogDesc || null,
    image: image ? image.replace('http://', 'https://') : null,
    title: ogTitle || title || 'undefined',
    url: canonical || url,
  };
};
