import { useContext } from 'react';
import NextLink from 'next/link';
import { Chip } from '@material-ui/core';
import { getPageTitle, GlobalContext, theme } from '@zoonk/utils';

interface TopicChipsProps {
  items: string[];
}

/**
 * Display a list of topics for an item in the "chip" format.
 */
const TopicChips = ({ items }: TopicChipsProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        margin: theme.spacing(1, 0),
      }}
    >
      {items.slice(0, 3).map((item) => {
        const title = getPageTitle(item);

        return (
          <NextLink
            href="/topics/[id]"
            as={`/topics/${item}`}
            key={item}
            passHref
          >
            <Chip
              clickable
              component="a"
              label={title}
              title={translate('learn_about', { title })}
              style={{ margin: theme.spacing(0.5) }}
            />
          </NextLink>
        );
      })}
    </div>
  );
};

export default TopicChips;
