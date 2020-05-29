import { forwardRef } from 'react';
import { Typography, TypographyProps } from '@material-ui/core';

const CustomTypography = forwardRef<HTMLSpanElement, TypographyProps>(
  (props, ref) => {
    return (
      <Typography ref={ref} variant="body1" color="textSecondary" {...props} />
    );
  },
);

export default CustomTypography;
