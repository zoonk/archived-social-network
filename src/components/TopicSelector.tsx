import { Fragment, useContext } from 'react';
import { Chip, Typography } from '@material-ui/core';
import { UILanguage, WikipediaSearchItem } from '@zoonk/models';
import { getPageTitle, GlobalContext, theme } from '@zoonk/utils';
import TopicSearch from './TopicSearch';

interface TopicSelectorProps {
  active?: string;
  error?: string | null;
  items: string[];
  language: UILanguage;
  onChange: (topics: string[]) => void;
}

/**
 * Select (and display) topics.
 * @property `active` - an active item which cannot be deleted.
 * @property `error` - display an error message.
 * @property `items` - a list of selected topics.
 * @property `language`
 * @property `onChange(topics)` - fires an event when the topics list is updated.
 */
const TopicSelector = ({
  active,
  error,
  items,
  language,
  onChange,
}: TopicSelectorProps) => {
  const { translate } = useContext(GlobalContext);

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
