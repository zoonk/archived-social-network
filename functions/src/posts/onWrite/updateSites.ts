import * as functions from 'firebase-functions';
import { isEqual } from 'lodash';
import { Post } from '@zoonk/models';
import { getMetadataFromUrl } from '../../helpers';

export const onWritePostUpdateSites = functions.firestore
  .document('posts/{id}')
  .onWrite(async (changes) => {
    const before = changes.before.data() as Post.Response | undefined;
    const after = changes.after.data() as Post.Response | undefined;
    const beforeLinks = before?.links?.filter(Boolean) || [];
    const afterLinks = after?.links?.filter(Boolean) || [];
    const noChanges = isEqual(beforeLinks, afterLinks);

    /**
     * Return when this post was deleted or there are no changes.
     */
    if (!after || noChanges) return false;

    const metadata = afterLinks.map((link) => getMetadataFromUrl(link));
    const sites = await Promise.all(metadata);
    const updates: Partial<Post.Response> = { sites };

    return changes.after.ref.update(updates);
  });
