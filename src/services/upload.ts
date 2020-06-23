import { storage } from '@zoonk/firebase/storage';
import { logImageUpload } from '@zoonk/utils';

/**
 * Upload a file to Firebase.
 * @param file to be uploaded.
 * @param folder directory name to be used on Firebase Storage.
 * @returns file URL.
 */
export const upload = async (file: File, folder: string): Promise<string> => {
  const ref = storage.ref();
  const now = new Date().getTime();

  // It uses the current timestamp to make sure we're creating a unique file.
  const fileUpload = ref.child(`${folder}/${file.name}-${now}`).put(file);
  const snap = await fileUpload;
  logImageUpload(folder);

  // Return a string containing the file URL.
  return snap.ref.getDownloadURL();
};
