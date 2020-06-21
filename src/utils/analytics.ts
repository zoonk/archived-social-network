export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA;

export interface TrackEvent {
  action: string;
  category?: string;
  label?: string;
  value: string | number;
}

export const setUserID = (uid?: string) => {
  if (!uid) return;
  (window as any).gtag('set', { user_id: uid });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  (window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const logEvent = ({ action, category, label, value }: TrackEvent) => {
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/exceptions
export const logError = (description: string, fatal?: boolean) => {
  (window as any).gtag('event', 'exception', { description, fatal });
};
