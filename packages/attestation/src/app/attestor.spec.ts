import { beforeAll, beforeEach, describe, test } from 'vitest';
import { createPublicClient, createWalletClient, fallback, http } from 'viem';
import {
  generatePrivateKey,
  privateKeyToAccount,
  signMessage,
} from 'viem/accounts';
import { sepolia } from 'viem/chains';
import ethers from 'ethers';

import Attestor from './attestor';
import {
  TRANSLATION_ATTESTATION_SCHEMA,
  encodeTranslationAttestationSchema,
} from '../domain/schemas/translation-attestation';

import {
  CONTRIBUTION_ATTESTATION_SCHEMA,
  encodeContributionAttestationSchema,
} from '../domain/schemas/contribution-attestion';
// we will migrate viem once eas sdk eas.connect support so
// https://github.com/ethereum-attestation-service/eas-sdk/issues/86
describe('attestation', () => {
  const alchemyAPIKey = process.env.ALCHEMY_API_KEY;

  let attestorWalletPrivateKey;

  const easContractAddress = '';
  const schemaRegistryContractAddress = '';

  beforeAll(() => {
    attestorWalletPrivateKey = generatePrivateKey();
    const attestorAccount = privateKeyToAccount(attestorWalletPrivateKey);
  });

  test('#attest translations', async () => {
    const receipentWalletPrivateKey = generatePrivateKey();
    const receipentAccount = privateKeyToAccount(receipentWalletPrivateKey);
    const provider = new ethers.AlchemyProvider(sepolia, alchemyAPIKey);
    const signer = new ethers.Wallet(attestorWalletPrivateKey, provider);

    const data = {
      sourceId: 'youtube-a',
      sourceStringId: 'string-1',
      translatedStringId: 'string-2',
      score: 90,
    };

    const recipientAddress = receipentAccount.address;

    const encodedData = encodeTranslationAttestationSchema(data);

    const attestor = new Attestor(
      signer,
      TRANSLATION_ATTESTATION_SCHEMA,
      schemaRegistryContractAddress,
      easContractAddress,
      recipientAddress,
    );

    const attestation = await attestor.attestOffChain(encodedData);
  });

  test('#attest contribution', async () => {
    const receipentWalletPrivateKey = generatePrivateKey();
    const receipentAccount = privateKeyToAccount(receipentWalletPrivateKey);
    const provider = new ethers.AlchemyProvider(sepolia, alchemyAPIKey);
    const signer = new ethers.Wallet(attestorWalletPrivateKey, provider);

    const data = {
      sourceId: 'youtube-a',
      allocation: 90,
    };

    const recipientAddress = receipentAccount.address;

    const attestor = new Attestor(
      signer,
      TRANSLATION_ATTESTATION_SCHEMA,
      schemaRegistryContractAddress,
      easContractAddress,
      recipientAddress,
    );

    const encodedData = encodeContributionAttestationSchema(data);

    const attestation = await attestor.attestOffChain(encodedData);
  });
});
