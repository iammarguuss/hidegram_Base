import * as crypto from 'crypto';

export const generateSHA256Hash = async (
  hexString: string,
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(hexString);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const generateNanoId = async (): Promise<string> => {
  const nano = await import('nanoid');
  const nanoid = nano.customAlphabet('1234567890abcdef', 64);

  return nanoid();
};
