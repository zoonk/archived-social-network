import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { Chapter } from '@zoonk/models';

/**
 * Call a chapter page in the frontend to rebuild it (SSG).
 */
export const onUpdateChapterRebuildPage = functions.firestore
  .document('chapters/{id}')
  .onUpdate((change) => {
    const { language } = change.after.data() as Chapter.Response;
    const url = `https://${language}.zoonk.org/chapters/${change.after.id}`;
    return fetch(url);
  });
