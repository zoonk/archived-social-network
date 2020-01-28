import { useContext } from 'react';
import { Paper, Tab, Tabs } from '@material-ui/core';
import { Description, Link, VideoLibrary } from '@material-ui/icons';
import { Post } from '@zoonk/models';
import { GlobalContext, theme } from '@zoonk/utils';

interface FormatSelectorProps {
  children: React.ReactNode;
  format: Post.Format;
  onSelect: (format: Post.Format) => void;
}

/**
 * Select a content format.
 */
const FormatSelector = ({
  children,
  format,
  onSelect,
}: FormatSelectorProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Paper>
      <Tabs
        value={format}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        onChange={(_, value) => onSelect(value)}
      >
        <Tab value="text" icon={<Description />} label={translate('text')} />
        <Tab value="link" icon={<Link />} label={translate('link')} />
        <Tab value="video" icon={<VideoLibrary />} label={translate('video')} />
      </Tabs>
      <section style={{ padding: theme.spacing(2) }}>{children}</section>
    </Paper>
  );
};

export default FormatSelector;
