import { env } from './configuration';

export const authSecret = {
  secret: 'Q3m8F7w4Z1r6T9y2',
  encryptedPwdKey: env('ENCRYPTED_PWD_KEY'),
};
