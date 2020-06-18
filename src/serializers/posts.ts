import { Post } from '@zoonk/models';
import { serializeFirebaseDate } from './date';
import { serializeLinkCollection } from './link';

export const serializePost = (
  snap: firebase.firestore.DocumentSnapshot<Post.Response>,
): Post.Get => {
  const data = snap.data()!;
  const editors = data.editors || [];
  const editorsData = data.editorsData || {};
  const content = JSON.parse(data.content);

  return {
    ...data,
    content,
    createdAt: serializeFirebaseDate(data.createdAt),
    createdBy: { ...data.createdBy, id: data.createdById },
    editors: editors.map((editor) => ({
      ...editorsData[editor],
      id: editor,
    })),
    editorsData,
    id: snap.id,
    links: data.links ? data.links.filter(Boolean) : null,
    sites: data.sites || serializeLinkCollection(data.links),
    updatedAt: serializeFirebaseDate(data.updatedAt),
  };
};
