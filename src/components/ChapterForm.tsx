import { useContext, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import { GlobalContext, imgSize } from '@zoonk/utils';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';

interface ChapterFormProps {
  data?: Chapter.Get;
  saving: boolean;
  onSubmit: (data: Omit<Chapter.EditableFields, 'order'>) => void;
  onDelete?: () => void;
}

/**
 * Form for editing a chapter.
 */
const ChapterForm = ({
  data,
  saving,
  onDelete,
  onSubmit,
}: ChapterFormProps) => {
  const { translate } = useContext(GlobalContext);
  const [title, setTitle] = useState<string>(data?.title || '');
  const [description, setDescription] = useState<string>(
    data?.description || '',
  );
  const [photo, setPhoto] = useState<string | null>(data?.photo || null);
  const descriptionMax = 500;
  const valid =
    title.length > 0 &&
    description.length > 0 &&
    description.length <= descriptionMax;

  return (
    <FormBase
      valid={valid}
      saving={saving}
      onDelete={onDelete}
      onSubmit={() => onSubmit({ description, photo, title })}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            fullWidth
            id="chapter-title"
            label={translate('title')}
            name="title"
            required
            type="text"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            multiline
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            fullWidth
            id="chapter-description"
            label={translate('description')}
            helperText={`${description.length} / ${descriptionMax}`}
            error={description.length > descriptionMax}
            required
            name="description"
          />
        </Grid>

        <Grid item xs={12}>
          <ImageUpload
            img={photo}
            category="chapters"
            size={imgSize}
            onSave={setPhoto}
          />
        </Grid>
      </Grid>
    </FormBase>
  );
};

export default ChapterForm;
