/* eslint-disable no-console */

/**
 * This is a fork from https://github.com/NoelOConnell/quill-image-uploader
 */

import Quill, { RangeStatic } from 'quill';
import LoadingImage from './ImageBlot';

interface UploaderOptions {
  upload: (file: File) => Promise<string>;
}

/**
 * Allow images to be uploaded to a server when they're added to the editor.
 */
class ImageUploader {
  public quill: Quill;
  public options: UploaderOptions;
  public range: RangeStatic | null;
  public fileHolder: HTMLInputElement | null = null;

  constructor(quill: Quill, options: UploaderOptions) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    if (typeof this.options.upload !== 'function') {
      console.warn(
        '[Missing config] upload function that returns a promise is required',
      );
    }

    const toolbar = this.quill.getModule('toolbar');
    toolbar.addHandler('image', this.selectLocalImage.bind(this));

    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);

    this.quill.root.addEventListener('drop', this.handleDrop, false);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
  }

  selectLocalImage() {
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement('input');
    this.fileHolder.setAttribute('type', 'file');
    this.fileHolder.setAttribute('accept', 'image/*');
    this.fileHolder.setAttribute('style', 'visibility:hidden');
    this.fileHolder.onchange = this.fileChanged.bind(this);
    document.body.appendChild(this.fileHolder);
    this.fileHolder.click();

    window.requestAnimationFrame(() => {
      if (this.fileHolder) {
        document.body.removeChild(this.fileHolder);
      }
    });
  }

  handleDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer?.files) {
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(
          event.clientX,
          event.clientY,
        );

        if (selection && range) {
          selection.setBaseAndExtent(
            range.startContainer,
            range.startOffset,
            range.startContainer,
            range.startOffset,
          );
        }
      } else {
        const selection = document.getSelection();
        const range = document.caretPositionFromPoint(
          event.clientX,
          event.clientY,
        );

        if (selection && range) {
          selection.setBaseAndExtent(
            range.offsetNode,
            range.offset,
            range.offsetNode,
            range.offset,
          );
        }
      }

      this.range = this.quill.getSelection();
      const file = event.dataTransfer.files[0];

      setTimeout(() => {
        this.range = this.quill.getSelection();
        this.readAndUploadFile(file);
      }, 0);
    }
  }

  handlePaste(event: ClipboardEvent) {
    const clipboard = event.clipboardData;

    // IE 11 is .files other browsers are .items
    if (clipboard && (clipboard.items || clipboard.files)) {
      const items = clipboard.items || clipboard.files;
      const IMAGE_MIME_REGEX = /^image\/(jpe?g|gif|png|svg|webp)$/i;

      for (let i = 0; i < items.length; i++) {
        if (IMAGE_MIME_REGEX.test(items[i].type)) {
          const file = items[i].getAsFile();

          if (file) {
            this.range = this.quill.getSelection();
            event.preventDefault();
            setTimeout(() => {
              this.range = this.quill.getSelection();
              this.readAndUploadFile(file);
            }, 0);
          }
        }
      }
    }
  }

  readAndUploadFile(file: File) {
    let isUploadReject = false;

    const fileReader = new FileReader();

    fileReader.addEventListener(
      'load',
      () => {
        if (!isUploadReject) {
          const base64ImageSrc = fileReader.result;
          if (typeof base64ImageSrc === 'string') {
            this.insertBase64Image(base64ImageSrc);
          }
        }
      },
      false,
    );

    if (file) {
      fileReader.readAsDataURL(file);
    }

    this.options.upload(file).then(
      (imageUrl: string) => {
        this.insertToEditor(imageUrl);
      },
      (error: string) => {
        isUploadReject = true;
        this.removeBase64Image();
        console.warn(error);
      },
    );
  }

  fileChanged() {
    if (this.fileHolder) {
      const file = this.fileHolder.files?.[0];
      if (file) this.readAndUploadFile(file);
    }
  }

  insertBase64Image(url: string) {
    const { range } = this;
    if (range) {
      this.quill.insertEmbed(
        range.index,
        LoadingImage.blotName,
        `${url}`,
        'user',
      );
    }
  }

  insertToEditor(url: string) {
    const { range } = this;
    if (range) {
      // Delete the placeholder image
      this.quill.deleteText(range.index, 3, 'user');
      // Insert the server saved image
      this.quill.insertEmbed(range.index, 'image', `${url}`, 'user');
      range.index++;
      this.quill.setSelection(range, 'user');
    }
  }

  removeBase64Image() {
    const { range } = this;
    if (range) {
      this.quill.deleteText(range.index, 3, 'user');
    }
  }
}

export default ImageUploader;
