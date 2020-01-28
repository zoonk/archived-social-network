/* eslint-disable camelcase */
export interface StripeEvent {
  api_version: string;
  created: number;
  data: {
    object: {
      cancel_url: string;
      client_reference_id: string;
      customer: string;
      customer_email: string;
      display_items: {};
      id: string;
      livemode: boolean;
      locale: string;
      mode: string;
      object: 'checkout.session';
      subscription: string;
      success_url: string;
    };
  };
  id: string;
  livemode: boolean;
  object: string;
  pending_webhooks: number;
  request: {
    id: string;
  };
  type: 'checkout.session.completed';
}
