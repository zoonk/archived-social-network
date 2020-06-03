import { config } from 'firebase-functions';
import mailClient from '@sendgrid/mail';

const SENDGRID_API_KEY = config().sendgrid.api_key;
mailClient.setApiKey(SENDGRID_API_KEY);

const contentTemplate = {
  en: 'd-820d183779e5421f82ca1e8e8769ae3b',
  pt: 'd-c343bf9961e0498ab807352f10eb57c0',
};

const commentsTemplate = {
  en: 'd-09ba3117481749b1aa082f86e986f79c',
  pt: 'd-c63b1c03031c4a409b689e9b6b919ec5',
};

export { commentsTemplate, contentTemplate, mailClient };
