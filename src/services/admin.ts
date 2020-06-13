import { db } from '@zoonk/firebase/db';
import { Admin } from '@zoonk/models';

export const getStats = async (): Promise<Admin.Stats> => {
  const stats = await db.doc('admin/stats').get();
  const data = stats.data() as Admin.Stats;
  return data;
};
