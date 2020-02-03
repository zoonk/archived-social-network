/* eslint-disable jsx-a11y/alt-text */

/**
 * Custom image renderer for markdown viewer.
 */
const Image = (props: any) => {
  return <img {...props} style={{ maxWidth: '100%' }} />;
};

export default Image;
