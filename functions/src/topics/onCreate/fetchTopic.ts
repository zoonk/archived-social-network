import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ContentMetadata, Profile, Topic } from '@zoonk/models';
import { getWikipediaPage } from '../../helpers';

const db = admin.firestore();

interface CreateFetchTopic
  extends Topic.Create,
    ContentMetadata.Create,
    ContentMetadata.Update {}

export const onCreateTopicFetchData = functions.firestore
  .document('topics/{topicId}')
  .onCreate(async (snap) => {
    const data = snap.data() as Partial<Topic.Response>;

    // When there's a user ID, then this topic data was already created in the frontend.
    if (data.createdById || !data.language) {
      return false;
    }

    const adminId = functions.config().admin.uid;
    const createdById = data.updatedById || adminId;
    const user = await db.doc(`profile/${createdById}`).get();
    const userProfile = user.data() as Profile.Get;
    const wikipediaSlug = snap.id.slice(0, snap.id.length - 3);
    const page = await getWikipediaPage(wikipediaSlug, data.language);

    const topic: CreateFetchTopic = {
      chapters: [],
      comments: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: userProfile,
      createdById,
      description: page.description,
      followers: 0,
      language: data.language,
      likes: 0,
      photo: page.photo,
      posts: 0,
      title: page.title,
      topics: [snap.id],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: userProfile,
      updatedById: createdById,
    };

    return snap.ref.update(topic);
  });
