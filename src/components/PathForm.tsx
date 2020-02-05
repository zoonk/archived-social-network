import { useContext, useEffect, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { ExpertLevel, Path } from '@zoonk/models';
import { appLanguage, GlobalContext } from '@zoonk/utils';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';
import LevelSelector from './LevelSelector';
import TopicSelector from './TopicSelector';

interface PathFormProps {
  saving: boolean;
  topicId?: string;
  data?: Path.Get;
  onSubmit: (data: Path.EditableFields, topics: string[]) => void;
  onDelete?: () => void;
}

/**
 * Form for editing a learning path.
 */
const PathForm = ({
  data,
  saving,
  onDelete,
  onSubmit,
  topicId,
}: PathFormProps) => {
  const { translate } = useContext(GlobalContext);
  const [title, setTitle] = useState<string>(data?.title || '');
  const [description, setDescription] = useState<string>(
    data?.description || '',
  );
  const [level, setLevel] = useState<ExpertLevel>(data?.level || 'beginner');
  const [photo, setPhoto] = useState<string | null>(data?.photo || null);
  const [topics, setTopics] = useState<string[]>(data?.topics || []);
  const descriptionMax = 1000;
  const valid =
    description.length > 0 &&
    description.length <= descriptionMax &&
    title.length > 0 &&
    topics.length > 0;

  // Add the current topicId when adding a new item.
  useEffect(() => {
    if (topicId && !data) {
      setTopics([topicId]);
    }
  }, [data, topicId]);

  return (
    <FormBase
      valid={valid}
      saving={saving}
      onDelete={onDelete}
      onSubmit={() => onSubmit({ description, level, photo, title }, topics)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            fullWidth
            id="path-title"
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
            helperText={`${description.length} / ${descriptionMax}`}
            error={description.length > descriptionMax}
            variant="outlined"
            fullWidth
            id="path-description"
            label={translate('description')}
            required
            name="description"
          />
        </Grid>

        <Grid item xs={12}>
          <LevelSelector active={level} onSelect={setLevel} />
        </Grid>

        <Grid item xs={12}>
          <TopicSelector
            active={topicId}
            items={topics}
            language={data ? data.language : appLanguage}
            onChange={setTopics}
          />
        </Grid>

        <Grid item xs={12}>
          <ImageUpload img={photo} category="paths" onSave={setPhoto} />
        </Grid>
      </Grid>
    </FormBase>
  );
};

export default PathForm;
