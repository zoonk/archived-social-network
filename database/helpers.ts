import * as firebase from '@firebase/testing';
import * as fs from 'fs';

const projectId = 'zoonk-testing';
const rules = fs.readFileSync('./database/firestore.rules', 'utf8');

export const initializeAdminApp = () => {
  return firebase.initializeAdminApp({ projectId }).firestore();
};

export const initializeFbApp = (auth: { uid: string | null } | undefined) => {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
};

export const loadFirestoreRules = () =>
  firebase.loadFirestoreRules({ projectId, rules });

export const removeApps = () =>
  Promise.all(firebase.apps().map((app) => app.delete()));
