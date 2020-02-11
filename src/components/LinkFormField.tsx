/* eslint-disable react/no-array-index-key */
import { Fragment, useContext } from 'react';
import { Grid, IconButton, TextField } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';

interface LinkFormFieldProps {
  links: string[];
  onChange: (index: number, value: string | null) => void;
}

/**
 * Form field for adding multiple links.
 */
const LinkFormField = ({ links, onChange }: LinkFormFieldProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Fragment>
      {links.map((value, index) => {
        const isLast = index === links.length - 1;

        return (
          <Grid container spacing={2} key={`post-url-${index}`}>
            <Grid item xs={12} sm={10} md={11}>
              <TextField
                value={value || ''}
                onChange={(e) => onChange(index, e.target.value)}
                variant="outlined"
                fullWidth
                id={`post-url-${index}`}
                label={translate('link')}
                helperText={index === 0 ? translate('link_helper') : undefined}
                name={`post-url-${index}`}
                type="url"
              />
            </Grid>

            <Grid item xs={3} sm={2} md={1}>
              {isLast && value.length > 5 && (
                <IconButton
                  color="primary"
                  onClick={() => onChange(index + 1, '')}
                >
                  <Add />
                </IconButton>
              )}

              {!isLast && (
                <IconButton
                  color="secondary"
                  onClick={() => onChange(index, null)}
                >
                  <Remove />
                </IconButton>
              )}
            </Grid>
          </Grid>
        );
      })}
    </Fragment>
  );
};

export default LinkFormField;
