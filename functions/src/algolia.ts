import { config } from 'firebase-functions';
import algoliasearch from 'algoliasearch';

const ALGOLIA_ID = config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = config().algolia.api_key;

export const algoliaClient = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
