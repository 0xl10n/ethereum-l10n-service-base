import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { createPublicClient, createWalletClient, fallback, http } from 'viem';
import {
  generatePrivateKey,
  privateKeyToAccount,
  signMessage,
} from 'viem/accounts';
// import { sepolia } from 'viem/chains';
import { ethers } from 'ethers';

import Attestor from './attestor';
import {
  TRANSLATION_ATTESTATION_SCHEMA,
  TRANSLATION_SCHEMA_UID,
  encodeTranslationAttestationSchema,
} from '../domain/schemas/translation-attestation';

import {
  CONTRIBUTION_ATTESTATION_SCHEMA,
  CONTRIBUTION_SCHEMA_UID,
  encodeContributionAttestationSchema,
} from '../domain/schemas/contribution-attestation';
import {
  Attestation,
  EAS_CONTRACT_ADDRESS,
  SCHEMA_REGISTRY_CONTRACT_ADDRESS,
} from '../adapters/eas';
import { zipAndEncodeToBase64 } from '@ethereum-attestation-service/eas-sdk';
// we will migrate viem once eas sdk eas.connect support so
// https://github.com/ethereum-attestation-service/eas-sdk/issues/86
describe('attestation', () => {
  const alchemyAPIKey = process.env.ALCHEMY_API_KEY;
  let signer;
  // 0xb63530c41B8CE6792f706344D4096C00bD61E73d
  let attestorWalletPrivateKey = process.env.ATTESTOR_PRIVATE_KEY!;

  const easContractAddress = EAS_CONTRACT_ADDRESS;

  const schemaRegistryContractAddress = SCHEMA_REGISTRY_CONTRACT_ADDRESS!;

  beforeAll(() => {
    // attestorWalletPrivateKey = generatePrivateKey();
    // const attestorAccount = privateKeyToAccount(attestorWalletPrivateKey);

    const provider = new ethers.AlchemyProvider(11155111, alchemyAPIKey);
    signer = new ethers.Wallet(attestorWalletPrivateKey, provider);
  });

  test('#attest translations', async () => {
    const receipentWalletPrivateKey = generatePrivateKey();
    const receipentAccount = privateKeyToAccount(receipentWalletPrivateKey);

    const data = {
      sourceId: 'youtube-a',
      sourceStringId: 'string-1',
      translatedStringId: 'string-2',
      score: 90,
    };

    const schemaUid = TRANSLATION_SCHEMA_UID;

    const recipientAddress = receipentAccount.address;

    const encodedData = encodeTranslationAttestationSchema(data);

    const attestor = new Attestor(
      signer,
      TRANSLATION_ATTESTATION_SCHEMA,
      schemaRegistryContractAddress,
      easContractAddress,
      recipientAddress,
      schemaUid,
    );

    // await attestor.registerSchema();

    const attestation = await attestor.attestOffChain(encodedData);
    expect((attestation as Attestation).sig.domain.name).toEqual(
      'EAS Attestation',
    );
    const token = zipAndEncodeToBase64(attestation);
    expect(token.startsWith('eNq')).toEqual(true);
  });

  test('#attest contribution', async () => {
    const receipentWalletPrivateKey = generatePrivateKey();
    const receipentAccount = privateKeyToAccount(receipentWalletPrivateKey);

    const data = {
      sourceId: 'youtube-a',
      allocation: 90,
    };

    const recipientAddress = receipentAccount.address;

    const schemaUid = CONTRIBUTION_SCHEMA_UID;
    const attestor = new Attestor(
      signer,
      CONTRIBUTION_ATTESTATION_SCHEMA,
      schemaRegistryContractAddress,
      easContractAddress,
      recipientAddress,
      schemaUid,
    );

    // await attestor.registerSchema();

    const encodedData = encodeContributionAttestationSchema(data);

    const attestation = await attestor.attestOffChain(encodedData);
    expect((attestation as Attestation).sig.domain.name).toEqual(
      'EAS Attestation',
    );

    const token = zipAndEncodeToBase64(attestation);
    expect(token.startsWith('eNq')).toEqual(true);
  });
});
