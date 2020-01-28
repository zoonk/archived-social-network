import { analytics, appLanguage, isProduction, rootUrl } from '@zoonk/utils';

const stripeKey = isProduction
  ? 'pk_live_SvAhWCO9zsGCddkYH5F3L3Ah'
  : 'pk_test_fuI5JHCoFejytVlaBWF6CcEi';
const returnUrl = isProduction ? rootUrl : 'http://localhost:3000';

const products = {
  en: isProduction ? 'plan_GVjmKcYSIpkqBu' : 'plan_GVl0jFGLzOLs9w',
  pt: isProduction ? 'plan_GVjnZAFPO6OJLq' : 'plan_GVl1iVm6S1ICve',
};

export const goToStripe = (email: string | null, uid: string) => {
  // eslint-disable-next-line no-undef
  const stripe = Stripe(stripeKey, { locale: appLanguage });

  const options: stripe.StripeClientCheckoutOptions = {
    items: [{ plan: products[appLanguage], quantity: 1 }],
    successUrl: `${returnUrl}/success`,
    cancelUrl: `${returnUrl}/upgrade`,
    clientReferenceId: uid,
  };

  if (email) {
    options.customerEmail = email;
  }

  analytics().logEvent('begin_checkout', {
    items: [
      {
        location_id: appLanguage,
        name: 'premium',
      },
    ],
  });

  return stripe.redirectToCheckout(options);
};
