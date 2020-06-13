import { Fragment, useEffect, useRef, useState } from 'react';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { debounce } from 'lodash';
import { UILanguage, WikipediaSearchItem } from '@zoonk/models';
import { searchTopic } from '@zoonk/services';
import useTranslation from './useTranslation';

interface TopicSearchProps {
  error?: string | null;
  helperText?: string;
  language: UILanguage;
  onSelect: (selected: WikipediaSearchItem | null) => void;
}

const TopicSearch = ({
  error,
  helperText,
  language,
  onSelect,
}: TopicSearchProps) => {
  const translate = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [topics, setTopics] = useState<WikipediaSearchItem[]>([]);
  const loading = useRef(false);

  const handleChange = debounce((value) => {
    searchTopic(value, language).then((list) => {
      loading.current = false;
      setTopics(list);
    });
  }, 300);

  useEffect(() => {
    if (!open) {
      setTopics([]);
    }
  }, [open]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={(option) => option.title}
      options={topics}
      onChange={(_: any, value: any) => onSelect(value)}
      noOptionsText={translate('search_topic_not_found')}
      loading={loading.current}
      autoHighlight
      renderInput={(params) => (
        <TextField
          {...params}
          error={Boolean(error)}
          label={translate('search_topic')}
          helperText={error || helperText}
          fullWidth
          onChange={(e) => {
            loading.current = true;
            handleChange(e.target.value);
          }}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading.current ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default TopicSearch;
