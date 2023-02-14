/* eslint-disable prettier/prettier */
import crypto from 'crypto';

const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

console.log(createSHA256('123', 'secret'));
