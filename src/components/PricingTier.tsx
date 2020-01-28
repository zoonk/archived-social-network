import { useContext } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';

interface PricingTierProps {
  title: string;
  description: string;
  price: string;
  buttonText?: string;
  onSelect?: () => void;
}

/**
 * Card for a single subscription tier.
 */
const PricingTier = ({
  buttonText,
  description,
  onSelect,
  price,
  title,
}: PricingTierProps) => {
  const { translate } = useContext(GlobalContext);
  const descriptionWithLineBreak = description.split('\n').filter(Boolean);

  return (
    <Card variant="outlined">
      <CardHeader
        title={title}
        titleTypographyProps={{ align: 'center' }}
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      />
      <CardContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            marginBottom: theme.spacing(2),
          }}
        >
          <Typography component="h2" variant="h3" color="textPrimary">
            {price}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            /{translate('year')}
          </Typography>
        </div>

        <ul>
          {descriptionWithLineBreak.map((line) => (
            <Typography
              component="li"
              variant="subtitle1"
              align="center"
              style={{ listStyle: 'none' }}
              key={line}
            >
              {line}
            </Typography>
          ))}
        </ul>
      </CardContent>

      {buttonText && onSelect && (
        <CardActions>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onSelect}
          >
            {buttonText}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default PricingTier;
