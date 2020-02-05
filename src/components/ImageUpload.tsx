import { useContext, useState } from 'react';
import { Avatar, Button, Grid, Typography } from '@material-ui/core';
import { AddAPhoto } from '@material-ui/icons';
import { ContentCategory, SnackbarAction } from '@zoonk/models';
import { upload } from '@zoonk/services';
import { firebaseError, GlobalContext, maxFileSize, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';

interface ImageUploadProps {
  category: ContentCategory | 'users';
  hideImg?: boolean;
  img: string | null;
  label?: string;
  size?: string;
  onSave: (url: string) => void;
}

/**
 * Upload an image to the backend storage.
 */
const ImageUpload = ({
  category,
  hideImg,
  img,
  label,
  size,
  onSave,
}: ImageUploadProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  const uploadPhoto = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }

    const file = fileList[0];

    if (file.size > maxFileSize) {
      setSnackbar({
        msg: translate('file_too_big'),
        type: 'error',
        log: {
          code: 'file_too_big',
          description: 'upload',
          opts: { category },
        },
      });
      return;
    }

    setSnackbar({ msg: translate('uploading'), type: 'progress' });

    upload(file, category)
      .then((photoURL) => {
        onSave(photoURL);
        setSnackbar({ msg: translate('saved'), type: 'success' });
      })
      .catch((e) => setSnackbar(firebaseError(e, 'photo_upload')));
  };

  return (
    <Grid container alignItems="center">
      {!img && !hideImg && (
        <Avatar>
          <AddAPhoto />
        </Avatar>
      )}

      {img && !hideImg && (
        <img
          src={img}
          alt={translate('photo_uploaded')}
          style={{ width: '150px' }}
        />
      )}

      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="update-topic-photo"
        type="file"
        onChange={(e) => uploadPhoto(e.target.files)}
      />
      <label
        htmlFor="update-topic-photo"
        style={{ margin: theme.spacing(0, 2) }}
      >
        <Button color="primary" component="span">
          {label || translate('photo_update')}
        </Button>
        <br />
        {size && (
          <Typography variant="caption">
            {translate('photo_suggested_size', { size })}
          </Typography>
        )}
      </label>

      <Snackbar action={snackbar} />
    </Grid>
  );
};

export default ImageUpload;
