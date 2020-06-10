import { useContext, useState } from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import { timestamp } from '@zoonk/firebase/db';
import { SnackbarAction, Topic } from '@zoonk/models';
import { updateTopic } from '@zoonk/services';
import { firebaseError, GlobalContext, imgSize } from '@zoonk/utils';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';
import Snackbar from './Snackbar';
import useAuth from './useAuth';

interface TopicEditProps {
  topic: Topic.Get;
}

/**
 * Form for updating a topic's data.
 */
const TopicEdit = ({ topic }: TopicEditProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
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
          <Typography variant="body1" gutterBottom>
            {translate('topic_desc_helper')}
          </Typography>
        </Grid>
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
          <ImageUpload
            img={photo}
            category="topics"
            size={imgSize}
            onSave={setPhoto}
          />
        </Grid>
      </Grid>
      <Snackbar action={snackbar} />
    </FormBase>
  );
};

export default TopicEdit;
