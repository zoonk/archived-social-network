import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid, TextField } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';

interface ChapterFormProps {
  data?: Chapter.Get;
  saving: boolean;
  onSubmit: (data: Chapter.EditableFields) => void;
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
  const { query } = useRouter();
  const [order, setOrder] = useState<number>(
    data?.order || Number(query.order) || 0,
  );
  const [title, setTitle] = useState<string>(data?.title || '');
  const [description, setDescription] = useState<string>(
    data?.description || '',
  );
  const [photo, setPhoto] = useState<string | null>(data?.photo || null);
  const valid = title.length > 0 && description.length > 0;

  return (
    <FormBase
      valid={valid}
      saving={saving}
      onDelete={onDelete}
      onSubmit={() => onSubmit({ description, order, photo, title })}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9}>
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

        <Grid item xs={12} sm={3}>
          <TextField
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            variant="outlined"
            fullWidth
            id="chapter-order"
            label={translate('order')}
            name="order"
            required
            type="number"
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
            required
            name="description"
          />
        </Grid>

        <Grid item xs={12}>
          <ImageUpload img={photo} category="chapters" onSave={setPhoto} />
        </Grid>
      </Grid>
    </FormBase>
  );
};

export default ChapterForm;
