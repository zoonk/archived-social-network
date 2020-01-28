import { useContext } from 'react';
import { Grid } from '@material-ui/core';
import { goToStripe } from '@zoonk/services';
import { GlobalContext, theme } from '@zoonk/utils';
import PricingTier from './PricingTier';

/**
 * Pricing card displaying all subscription plans.
 */
const Pricing = () => {
  const { translate, user } = useContext(GlobalContext);

  const handlePayment = () => {
    if (!user) {
      return;
    }

    goToStripe(user.email, user.uid);
  };

  return (
    <Grid
      container
      spacing={5}
      style={{ marginTop: theme.spacing(5) }}
      alignItems="flex-end"
    >
      <Grid item xs={12} sm={6}>
        <PricingTier
          title={translate('subscribe_free_title')}
          description={translate('subscribe_free_desc')}
          price={translate('subscribe_free_price')}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <PricingTier
          title={translate('subscribe_premium_title')}
          description={translate('subscribe_premium_desc')}
          price={translate('subscribe_premium_price')}
          buttonText={translate('subscribe_premium_btn')}
          onSelect={handlePayment}
        />
      </Grid>
    </Grid>
  );
};

export default Pricing;
