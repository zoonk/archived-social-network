import { config } from 'firebase-functions';
import mailClient from '@sendgrid/mail';

const SENDGRID_API_KEY = config().sendgrid.api_key;
mailClient.setApiKey(SENDGRID_API_KEY);

const contentTemplate = {
  en: 'd-820d183779e5421f82ca1e8e8769ae3b',
  pt: 'd-c343bf9961e0498ab807352f10eb57c0',
};

export { contentTemplate, mailClient };
