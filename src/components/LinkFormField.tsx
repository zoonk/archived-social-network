/* eslint-disable no-new */
/* eslint-disable react/no-array-index-key */
import { Fragment, useContext } from 'react';
import { Grid, IconButton, TextField } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';

interface LinkFormFieldProps {
  format: 'link' | 'video';
  links: string[];
  onChange: (index: number, value: string | null) => void;
}

/**
 * Form field for adding multiple links.
 */
const LinkFormField = ({ format, links, onChange }: LinkFormFieldProps) => {
  const { translate } = useContext(GlobalContext);
  const isLink = format === 'link';

  return (
    <Fragment>
      {links.map((value, index) => {
        let canAdd = false;
        let canRemove = false;

        try {
          // If a URL is valid, then users can add a new one.
          new URL(value);
          canAdd = true;
        } catch (e) {
          // If the URL is invalid, then it's not possible to add.
          canAdd = false;

          // Can only remove invalid URLs whose index isn't the first one.
          canRemove = index > 0;
        }

        return (
          <Grid
            alignItems="center"
            container
            spacing={2}
            key={`post-url-${index}`}
          >
            <Grid
              item
              xs={isLink ? 9 : 12}
              sm={isLink ? 10 : 12}
              md={isLink ? 11 : 12}
            >
              <TextField
                required={index === 0}
                value={links[index] || ''}
                onChange={(e) => onChange(index, e.target.value)}
                variant="outlined"
                fullWidth
                id={`post-url-${index}`}
                label={isLink ? translate('link') : translate('video_link')}
                name={`post-url-${index}`}
                type="url"
              />
            </Grid>

            {isLink && (
              <Grid item xs={3} sm={2} md={1}>
                {canAdd && (
                  <IconButton
                    color="primary"
                    onClick={() => onChange(index + 1, '')}
                  >
                    <Add />
                  </IconButton>
                )}

                {canRemove && (
                  <IconButton
                    color="secondary"
                    onClick={() => onChange(index, null)}
                  >
                    <Remove />
                  </IconButton>
                )}
              </Grid>
            )}
          </Grid>
        );
      })}
    </Fragment>
  );
};

export default LinkFormField;
