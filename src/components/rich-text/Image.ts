/* eslint-disable no-param-reassign */
import Quill from 'quill';

const ImageFormatAttributesList = ['alt', 'width', 'style'];
const BaseImageFormat = Quill.import('formats/image');

/**
 * Handle image attributes (e.g. style, width, etc.)
 */
class ImageFormat extends BaseImageFormat {
  static formats(domNode: Element) {
    return ImageFormatAttributesList.reduce((formats: any, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  format(name: string, value: string) {
    // Ignore the height property to keep a consistent aspect ratio.
    if (name === 'height') return;
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

export default ImageFormat;
