import { useRouter } from 'next/router';
import { Button, ButtonGroup } from '@material-ui/core';
import useTranslation from './useTranslation';

interface TimelineHeaderProps {
  active: 'all' | 'following';
}

const TimelineHeader = ({ active }: TimelineHeaderProps) => {
  const translate = useTranslation();
  const { push } = useRouter();

  return (
    <nav>
      <ButtonGroup color="primary">
        <Button
          variant={active === 'following' ? 'contained' : undefined}
          disableElevation
          onClick={() => push('/following')}
        >
          {translate('following')}
        </Button>
        <Button
          variant={active === 'all' ? 'contained' : undefined}
          disableElevation
          onClick={() => push('/')}
        >
          {translate('all')}
        </Button>
      </ButtonGroup>
    </nav>
  );
};

export default TimelineHeader;
