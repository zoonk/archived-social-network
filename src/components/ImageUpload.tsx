import { Avatar, Button, Grid, Typography } from '@material-ui/core';
import { AddAPhoto } from '@material-ui/icons';
import { ContentCategory } from '@zoonk/models';
import { upload } from '@zoonk/services';
import { maxFileSize, theme } from '@zoonk/utils';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

interface ImageUploadProps {
  category: ContentCategory | 'users';
  hideImg?: boolean;
  id?: string;
  img?: string | null;
  label?: string;
  size?: string;
  onSave: (url: string) => void;
}

const ImageUpload = ({
  category,
  hideImg,
  id,
  img,
  label,
  size,
  onSave,
}: ImageUploadProps) => {
  const translate = useTranslation();
  const { snackbar } = useSnackbar();

  const uploadPhoto = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }

    const file = fileList[0];

    if (file.size > maxFileSize) {
      snackbar('error', translate('file_too_big'));
      return;
    }

    snackbar('progress', translate('uploading'));

    upload(file, category)
      .then((photoURL) => {
        onSave(photoURL);
        snackbar('success');
      })
      .catch((e) => snackbar('error', e.message));
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
        id={id || 'update-photo'}
        type="file"
        onChange={(e) => uploadPhoto(e.target.files)}
      />
      <label
        htmlFor={id || 'update-photo'}
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
    </Grid>
  );
};

export default ImageUpload;
