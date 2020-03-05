import { useContext, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import { Grid, TextField } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import { searchChapter } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';
import ChapterSelector from './ChapterSelector';
import FormBase from './FormBase';

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
  const [title, setTitle] = useState<string>(data?.title || '');
  const [description, setDescription] = useState<string>(
    data?.description || '',
  );
  const [search, setSearch] = useState<ReadonlyArray<Chapter.Index>>([]);
  const throttled = useRef(
    throttle((query: string) => {
      searchChapter(query).then(setSearch);
    }, 1000),
  );

  const descriptionMax = 500;
  const valid =
    title.length > 0 &&
    description.length > 0 &&
    description.length <= descriptionMax;

  // Search existing chapters when creating a new one.
  useEffect(() => {
    if (!data && title.length > 3) {
      throttled.current(title);
    }
  }, [data, title]);

  return (
    <FormBase
      valid={valid}
      saving={saving}
      onDelete={onDelete}
      onSubmit={() =>
        onSubmit({ description, examples: [], lessons: [], title })
      }
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

        <ChapterSelector chapters={search} />

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
