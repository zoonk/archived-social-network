/* eslint-disable no-param-reassign */
import Quill from 'quill';
import { containsVimeoUrl } from '@zoonk/utils';

const BlockEmbed = Quill.import('blots/block/embed');
const Link = Quill.import('formats/link');

/**
 * Handle video embeds.
 */
class Video extends BlockEmbed {
  static blotName = 'video';
  static tagName = 'div';
  static className = 'ql-video';

  static create(value: string) {
    const node = super.create(value);

    const child = document.createElement('iframe');
    child.setAttribute('frameborder', '0');
    child.setAttribute('allowfullscreen', 'true');
    child.setAttribute('src', this.sanitize(value));
    child.classList.add('ql-video-reponsive');

    node.appendChild(child);

    return node;
  }

  static sanitize(url: string) {
    const vimeo = containsVimeoUrl(url);

    if (vimeo) {
      url = `https://player.vimeo.com/video/${vimeo}`;
    }

    return Link.sanitize(url);
  }

  static value(domNode: Document) {
    const iframe = domNode.querySelector('iframe');
    return iframe?.getAttribute('src');
  }
}

export default Video;
