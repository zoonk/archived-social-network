import { Box, LinearProgressProps, Typography } from '@material-ui/core';
import BorderLinearProgress from './BorderLinearProgress';

const LinearProgressWithLabel = (props: LinearProgressProps) => {
  const { value } = props;
  let progressValue: number = value || 0;
  if (progressValue < 0) progressValue = 0;
  if (progressValue > 100) progressValue = 100;

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {`${Math.round(progressValue)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;
