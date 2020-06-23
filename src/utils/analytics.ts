import { ContentCategory, Post } from '@zoonk/models';
import { appLanguage } from './settings';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA;

export interface TrackEvent {
  action: string;
  category?: string;
  label?: string;
  value: string | number;
  uid?: string;
}

export const setUserID = (uid?: string) => {
  if (!uid) return;
  (window as any).gtag('set', { user_id: uid });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const logEvent = ({
  action,
  category,
  label,
  uid,
  value,
}: TrackEvent) => {
  setUserID(uid);
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};

const logAppLanguage = () => {
  logEvent({
    action: 'view',
    category: 'app_language',
    label: appLanguage,
    value: 1,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string, uid?: string) => {
  setUserID(uid);
  (window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
  logAppLanguage();
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/exceptions
export const logError = (description: string, fatal?: boolean) => {
  (window as any).gtag('event', 'exception', { description, fatal });
};

export const logEdit = (
  category: ContentCategory | Post.Category,
  action: 'add' | 'edit' | 'delete',
  uid: string,
) => {
  logEvent({
    action,
    category,
    label: appLanguage,
    value: 1,
    uid,
  });
};

export const logFollow = (
  action: 'follow' | 'unfollow',
  collection: string,
  doc: string,
  uid: string,
) => {
  logEvent({
    action,
    category: collection,
    label: doc,
    value: 1,
    uid,
  });
};

export const logLike = (liked: boolean, itemPath: string, uid: string) => {
  logEvent({
    action: liked ? 'like' : 'unlike',
    category: appLanguage,
    label: itemPath,
    value: 1,
    uid,
  });
};

export const logImageUpload = (folder: string) => {
  logEvent({
    action: 'upload',
    category: 'image',
    label: folder,
    value: 1,
  });
};

export const logSignIn = (method: string) => {
  (window as any).gtag('event', 'login', { method });
};

export const logSignUp = (method: string) => {
  (window as any).gtag('event', 'sign_up', { method });
};

export const logPostCreation = (value: number, category: Post.Category) => {
  (window as any).gtag('event', 'timing_complete', {
    name: 'add',
    value,
    event_category: 'Create post',
    event_label: category,
  });
};
