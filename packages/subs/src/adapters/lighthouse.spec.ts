import { beforeEach, describe, expect, test } from 'vitest';
import {
  createLighthouseParams,
  getFileAsBuffer,
  uploadEncryptedFileWithText,
  uploadText,
} from './lighthouse.ts';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const cid = 'QmWnzVB4MDsUWSinrD5LyQNMYXD9oxh3cxq8RLVZ498nZw';
const lighthouseApiKey = process.env.LIGHTHOUSE_API_KEY!;
describe('lighthouse', () => {
  const walletPrivateKey = generatePrivateKey();
  test('uploadFile', async () => {
    const account = privateKeyToAccount(walletPrivateKey);
    const params = await createLighthouseParams({
      lighthouseApiKey,
      walletPrivateKey,
    });
    const response = await uploadEncryptedFileWithText('test', ...params);

    expect(!!response.cid).toEqual(true);

    console.log('cid', cid);
  });

  test('#uploadText', async () => {
    const response = await uploadText('some-content', lighthouseApiKey);

    expect(!!response?.name).toEqual(true);
  });

  test('#getFile', async () => {
    const buffer = await getFileAsBuffer(cid);
    expect(buffer.toString()).toEqual('some-content');
  });
});
