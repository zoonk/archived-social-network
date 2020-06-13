import { useState } from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import { Group } from '@zoonk/models';
import { appLanguage } from '@zoonk/utils';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';
import TopicSelector from './TopicSelector';
import useTranslation from './useTranslation';

interface GroupFormProps {
  data?: Group.Get;
  saving: boolean;
  topicIds?: string[];
  onSubmit: (data: Group.EditableFields, topics: string[]) => void;
  onDelete?: () => void;
}

const GroupForm = ({
  data,
  saving,
  topicIds,
  onDelete,
  onSubmit,
}: GroupFormProps) => {
  const translate = useTranslation();
  const [title, setTitle] = useState<string>(data?.title || '');
  const [description, setDescription] = useState<string>(
    data?.description || '',
  );
  const [photo, setPhoto] = useState<string | null>(data?.photo || null);
  const [topics, setTopics] = useState<string[]>(
    data?.topics || topicIds || [],
  );

  const descriptionMax = 1000;
  const valid =
    title.length > 0 &&
    description.length > 0 &&
    description.length <= descriptionMax &&
    topics.length > 0;

  return (
    <FormBase
      valid={valid}
      saving={saving}
      onDelete={onDelete}
      onSubmit={() => onSubmit({ description, photo, title }, topics)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            fullWidth
            id="group-title"
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
            id="group-description"
            label={translate('description')}
            helperText={`${description.length} / ${descriptionMax}`}
            error={description.length > descriptionMax}
            required
            name="description"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {translate('cover')}
          </Typography>
          <ImageUpload
            id="add-cover-img"
            img={photo}
            category="posts"
            onSave={setPhoto}
          />
        </Grid>

        <Grid item xs={12}>
          <TopicSelector
            active={topicIds ? topicIds[0] : undefined}
            items={topics}
            language={data ? data.language : appLanguage}
            onChange={setTopics}
          />
        </Grid>
      </Grid>
    </FormBase>
  );
};

export default GroupForm;
