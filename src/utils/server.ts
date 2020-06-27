import { ServerResponse } from 'http';

/**
 * Use Vercel's serverless pre-rendering (SPR) feature:
 * https://vercel.com/blog/serverless-pre-rendering
 */
export const preRender = (res?: ServerResponse) => {
  if (res) {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  }
};
