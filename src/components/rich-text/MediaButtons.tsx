import { Fragment, useRef } from 'react';
import { useSlate } from 'slate-react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import {
  Image,
  Link,
  LinkOff,
  OndemandVideo,
  PictureAsPdf,
} from '@material-ui/icons';
import { upload } from '@zoonk/services';
import { maxFileSize } from '@zoonk/utils';
import { isBlockActive } from './blocks';
import { insertImage } from './images';
import { insertLink } from './links';
import { insertPDF, removePDF } from './pdf';
import { insertVideo, removeVideo } from './videos';
import useSnackbar from '../useSnackbar';
import useTranslation from '../useTranslation';

const MediaButtons = () => {
  const translate = useTranslation();
  const { snackbar } = useSnackbar();
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const editor = useSlate();
  const isLink = isBlockActive(editor, 'link');
  const isPDF = isBlockActive(editor, 'pdf');
  const isVideo = isBlockActive(editor, 'video');

  const handleLink = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    insertLink(editor, translate('link_add'));
  };

  const handleVideo = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (isVideo) {
      removeVideo(editor);
      return;
    }

    const url = window.prompt(translate('video_link'));
    if (!url) return;
    insertVideo(editor, url);
  };

  const handlePDF = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (isVideo) {
      removePDF(editor);
      return;
    }

    const url = window.prompt(translate('pdf_link'));
    if (!url) return;
    insertPDF(editor, url);
  };

  const uploadPhoto = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const file = files[0];

    if (file.size > maxFileSize) {
      snackbar('error', translate('file_too_big'));
      return;
    }

    snackbar('progress', translate('uploading'));

    upload(file, 'posts')
      .then((photoURL) => {
        insertImage(editor, photoURL);
        snackbar('success');
      })
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <Fragment>
      <ToggleButtonGroup
        size="small"
        aria-label={translate('formatting_blocks')}
      >
        <ToggleButton
          value="link"
          aria-label={translate('formatting_link')}
          title={translate('formatting_link')}
          selected={isLink}
          onMouseDown={handleLink}
        >
          {isLink ? <LinkOff /> : <Link />}
        </ToggleButton>
        <ToggleButton
          value="image"
          aria-label={translate('formatting_image')}
          title={translate('formatting_image')}
          selected={isBlockActive(editor, 'image')}
          onMouseDown={() => uploadRef.current?.click()}
        >
          <Image />
        </ToggleButton>
        <ToggleButton
          value="video"
          aria-label={translate('video')}
          title={translate('video')}
          selected={isVideo}
          onMouseDown={handleVideo}
        >
          <OndemandVideo />
        </ToggleButton>
        <ToggleButton
          value="pdf"
          aria-label={translate('formatting_pdf')}
          title={translate('formatting_pdf')}
          selected={isPDF}
          onMouseDown={handlePDF}
        >
          <PictureAsPdf />
        </ToggleButton>
      </ToggleButtonGroup>
      <input
        ref={uploadRef}
        style={{ display: 'none' }}
        accept="image/*"
        id="insert-image"
        type="file"
        onChange={(e) => uploadPhoto(e.target.files)}
      />
    </Fragment>
  );
};

export default MediaButtons;
