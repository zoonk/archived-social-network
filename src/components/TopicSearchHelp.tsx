import { Container, Dialog, Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface TopicSearchHelpProps {
  open: boolean;
  onClose: () => void;
}

const TopicSearchHelp = ({ open, onClose }: TopicSearchHelpProps) => {
  const translate = useTranslation();

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
