/**
 * This is a fork from https://github.com/NoelOConnell/quill-image-uploader
 */

import Quill from 'quill';

const InlineBlot = Quill.import('blots/block');

/**
 * Handle the loading state when uploading an image.
 */
class LoadingImage extends InlineBlot {
  static create(src: string | true) {
    const node = super.create(src);
    if (src === true) return node;

    const image = document.createElement('img');
    image.setAttribute('src', src);
    node.appendChild(image);
    return node;
  }

  deleteAt(index: number, length: number) {
    super.deleteAt(index, length);
    this.cache = {};
  }

  static value(domNode: any) {
    const { src, custom } = domNode.dataset;
    return { src, custom };
  }
}

LoadingImage.blotName = 'imageBlot';
LoadingImage.className = 'image-uploading';
LoadingImage.tagName = 'span';
Quill.register({ 'formats/imageBlot': LoadingImage });

export default LoadingImage;
