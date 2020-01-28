import { ServerResponse } from 'http';

/**
 * Use Now's serverless pre-rendering (SPR) feature:
 * https://zeit.co/blog/serverless-pre-rendering
 */
export const preRender = (res?: ServerResponse) => {
  if (res) {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  }
};
