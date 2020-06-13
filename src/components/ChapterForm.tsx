import { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import FormBase from './FormBase';
import useTranslation from './useTranslation';

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
  const translate = useTranslation();
  const [title, setTitle] = useState<string>(data?.title || '');
  const [description, setDescription] = useState<string>(
    data?.description || '',
  );

  const descriptionMax = 1000;
  const valid =
    title.length > 0 &&
    description.length > 0 &&
    description.length <= descriptionMax;

  return (
    <FormBase
      valid={valid}
      saving={saving}
      onDelete={onDelete}
      onSubmit={() => onSubmit({ description, title })}
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
      </Grid>
    </FormBase>
  );
};

export default ChapterForm;
