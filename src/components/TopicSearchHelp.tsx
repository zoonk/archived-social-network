import { useContext, useEffect } from 'react';
import { Container, Dialog, Typography } from '@material-ui/core';
import { analytics } from '@zoonk/firebase/analytics';
import { GlobalContext, theme } from '@zoonk/utils';

interface TopicSearchHelpProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog containing a helper info about searching topics.
 */
const TopicSearchHelp = ({ open, onClose }: TopicSearchHelpProps) => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    if (open) {
      analytics().logEvent('help_tooltip', {
        section: 'topic_add',
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Container style={{ margin: theme.spacing(2, 0) }}>
        <Typography variant="body2">
          {translate('search_topic_help')}
        </Typography>
      </Container>
    </Dialog>
  );
};

export default TopicSearchHelp;
