import { useState } from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import { timestamp } from '@zoonk/firebase/db';
import { Topic } from '@zoonk/models';
import { updateTopic } from '@zoonk/services';
import { imgSize } from '@zoonk/utils';
import FormBase from './FormBase';
import ImageUpload from './ImageUpload';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

interface TopicEditFormProps {
  topic: Topic.Get;
}

const TopicEditForm = ({ topic }: TopicEditFormProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const { action, snackbar } = useSnackbar();
  const [description, setDescription] = useState<string>(topic.description);
  const [photo, setPhoto] = useState<string | null>(topic.photo);
  const descriptionMax = 1000;
  const isValid = description.length <= descriptionMax;

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = () => {
    snackbar('progress');

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
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <FormBase
      valid={isValid}
      saving={action === 'progress'}
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
    </FormBase>
  );
};

export default TopicEditForm;
