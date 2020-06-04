import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Button, ButtonGroup } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

interface TimelineHeaderProps {
  active: 'all' | 'following';
}

const TimelineHeader = ({ active }: TimelineHeaderProps) => {
  const { translate } = useContext(GlobalContext);
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
