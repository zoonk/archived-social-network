import * as functions from 'firebase-functions';
import { getMetadataFromUrl } from '../../helpers';

export const generateMetadata = functions.https.onCall(async (data) => {
  const { url } = data;
  const metadata = await getMetadataFromUrl(url);
  return metadata;
});
