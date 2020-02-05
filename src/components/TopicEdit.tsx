import { useContext, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { SnackbarAction, Topic } from '@zoonk/models';
import { updateTopic } from '@zoonk/services';
import { firebaseError, GlobalContext, timestamp } from '@zoonk/utils';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';
import Snackbar from './Snackbar';

interface TopicEditProps {
  topic: Topic.Get;
}

/**
 * Form for updating a topic's data.
 */
const TopicEdit = ({ topic }: TopicEditProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [description, setDescription] = useState<string>(topic.description);
  const [photo, setPhoto] = useState<string | null>(topic.photo);
  const descriptionMax = 1000;
  const isValid = description.length <= descriptionMax;

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = () => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    updateTopic(
      {
        description,
        photo,
        updatedAt: timestamp,
        updatedBy: profile,
        updatedById: user.uid,
      },
      topic.id,
    )
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'topic_edit')));
  };

  return (
    <FormBase
      valid={isValid}
      saving={snackbar?.type === 'progress'}
      onSubmit={handleSubmit}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            multiline
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText={`${description.length} / ${descriptionMax}`}
            error={description.length > descriptionMax}
            variant="outlined"
            fullWidth
            id="topic-description-update"
            label={translate('description')}
            name="description"
          />
        </Grid>

        <Grid item xs={12}>
          <ImageUpload img={photo} category="topics" onSave={setPhoto} />
        </Grid>
      </Grid>
      <Snackbar action={snackbar} />
    </FormBase>
  );
};

export default TopicEdit;
