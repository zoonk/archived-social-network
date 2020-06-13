import { Fragment } from 'react';
import { Chip, Typography } from '@material-ui/core';
import { UILanguage, WikipediaSearchItem } from '@zoonk/models';
import { getPageTitle, theme } from '@zoonk/utils';
import TopicSearch from './TopicSearch';
import useTranslation from './useTranslation';

interface TopicSelectorProps {
  active?: string;
  error?: string | null;
  items: string[];
  language: UILanguage;
  onChange: (topics: string[]) => void;
}

const TopicSelector = ({
  active,
  error,
  items,
  language,
  onChange,
}: TopicSelectorProps) => {
  const translate = useTranslation();

  // Remove a topic from the list.
  const deleteTopic = (item: string) => {
    onChange(items.filter((topic) => topic !== item));
  };

  // Add a new topic to the list.
  const selectTopic = (item: WikipediaSearchItem | null) => {
    if (item) {
      onChange([...items, `${item.slug}_${language}`]);
    }
  };

  return (
    <Fragment>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {translate('topics')} *
      </Typography>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          margin: theme.spacing(1, 0),
        }}
      >
        {[...new Set(items)].map((item) => (
          <Chip
            key={item}
            label={getPageTitle(item)}
            onDelete={item === active ? undefined : () => deleteTopic(item)}
            style={{ margin: theme.spacing(0.5) }}
          />
        ))}
      </div>

      <TopicSearch
        error={error}
        helperText={translate('topic_selector_helper')}
        language={language}
        onSelect={selectTopic}
      />
    </Fragment>
  );
};

export default TopicSelector;
