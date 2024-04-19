import got from 'got';
import lighthouse from '@lighthouse-web3/sdk';
import { Hex, createWalletClient, http } from 'viem';
import { privateKeyToAccount, signMessage } from 'viem/accounts';
import { filecoinCalibration, sepolia } from 'viem/chains';
import kavach from '@lighthouse-web3/kavach';
import { writeFileSync } from 'fs';
import tmp from 'tmp';

// clien to cache
export const createLighthouseParams = async (
  options: any,
): Promise<[string, string, string]> => {
  const { lighthouseApiKey, walletPrivateKey } = options;
  const account = privateKeyToAccount(walletPrivateKey);

  const signedMessage = await signAuthMessage(account);
  return [lighthouseApiKey, account.address, signedMessage];
};

export const signAuthMessage = async (account: any) => {
  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  const authMessage = await kavach.getAuthMessage(account.address);

  return client.signMessage({
    account,
    message: authMessage.message,
  });
};

export const uploadText = async (text: string, apiKey: string) => {
  if (!text) {
    throw new Error('Empty text');
  }

  const tmpobj = tmp.fileSync();
  writeFileSync(tmpobj.name, text);
  const response = await lighthouse.upload(tmpobj.name, apiKey);

  const { data } = response;

  return {
    name: data.Name,
    cid: data.Hash,
  };
};

export const uploadEncryptedFileWithText = async (
  text: string,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
) => {
  const response = await lighthouse.textUploadEncrypted(
    text,
    apiKey,
    publicKey,
    signedMessage,
  );

  const { data } = response;

  return {
    name: data.Name,
    cid: data.Hash,
  };
};

export const getFileAsBuffer = async (cid: string) => {
  return got('https://gateway.lighthouse.storage/ipfs/' + cid).buffer();
};
