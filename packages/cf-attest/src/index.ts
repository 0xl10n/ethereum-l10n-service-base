import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
  Offchain,
  OffchainAttestationVersion,
  SignedOffchainAttestation,
} from '@ethereum-attestation-service/eas-sdk';
import * as jose from 'jose';

import { ethers, Wallet } from 'ethers';

import {
  TRANSLATION_ATTESTATION_SCHEMA,
  encodeTranslationAttestationSchema,
  Attestor,
} from '@repo/attestation';
import { zipAndEncodeToBase64 } from '../../attestation/index';

export interface Env {
  TEST_WALLET_PRIVATE_KEY: string;
  ALCHEMY_API_KEY: string;
  ENVIRONMENT: string;
  EAS_CONTRACT_ADDRESS: string;
  SCHEMA_REGISTRY_CONTRACT_ADDRESS: string;
}

const TRANSLATION_SCHEMA_UID =
  '0xdcf13573c96f6ea7bc355d4a7289bf43db18eb2dac6679e12cb764abcbb264a6';

export type RequestParams = {
  network: string;
  recipientAddress: string;
  attestationData: {
    sourceId: string;
    sourceStringId: string;
    translatedStringId: string;
    score: number;
  };
};

async function handleRequest(request: Request, env: Env) {
  const params = (await request.json()) as RequestParams;

  const { attestationData } = params;

  console.log('ENVIRONMENT', env.ENVIRONMENT);

  console.log('EAS_CONTRACT_ADDRESS', env.EAS_CONTRACT_ADDRESS);

  const network = 'sepolia';

  const apiKey = env.ALCHEMY_API_KEY;

  const EAS_CONTRACT_ADDRESS = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';

  const easContractAddress = EAS_CONTRACT_ADDRESS;

  const SCHEMA_REGISTRY_CONTRACT_ADDRESS =
    '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0';

  const recipientAddress = '0x9FaD3583CBa4A1edF511A589f215A87B524D83e7';

  const provider = new ethers.AlchemyProvider(network, apiKey);

  const signer = new Wallet(env.TEST_WALLET_PRIVATE_KEY, provider);

  const encodedData = encodeTranslationAttestationSchema(attestationData);

  const attestor = new Attestor(
    signer,
    TRANSLATION_ATTESTATION_SCHEMA,
    SCHEMA_REGISTRY_CONTRACT_ADDRESS,
    easContractAddress,
    recipientAddress,
    TRANSLATION_SCHEMA_UID,
  );

  const attestation = await attestor.attestOffChain(encodedData);

  return attestation;
}

const authorize = async (token: string) => {
  const JWKS = jose.createLocalJWKSet({
    keys: [
      {
        kty: 'EC',
        x: 'bTNuHA5hl4ou8gchgwNK-phvd8PhYbJ7FWXzIHcayng',
        y: 'ks0dqrkbFcqrDrwpsnojigAU13HQPEqzJGF5g9rLk2Q',
        crv: 'P-256',
        kid: 'a6y70IMm3wqNQivKtApC-ovp1_wH-hfa1pzR03gJ5lo',
        use: 'sig',
        alg: 'ES256',
      },
      {
        kty: 'EC',
        x: 'D6-_lm173okkjbywGlgRFQpE3R5xLC0EIuJVTFp94po',
        y: 'z9KwY-hgfGwBClNCGsIcp9K7-Iu24koG8NvKSldsqEY',
        crv: 'P-256',
        kid: '1C2Djb2HxKxsYnsrL80fobwjl3aieNx2OcrwMMJBziw',
        use: 'sig',
        alg: 'ES256',
      },
    ],
  });

  const { payload, protectedHeader } = await jose.jwtVerify(token, JWKS, {
    issuer: 'privy.io',
    // app id
    audience: 'clv8gazq204exi1o8ryjhe3xw',
  });

  return {
    isVerified: payload?.iss,
    payload,
  };
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const authorization = request.headers.get('Authorization');

    const token = (authorization || '').replace('Bearer ', '');

    try {
      if (!token) {
        throw new Error('Unauthorized');
      }
      const { payload, isVerified } = await authorize(token);

      console.log('token', token);

      if (!isVerified) {
        throw new Error('Unauthorized');
      }
    } catch (err) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    let attestation = await handleRequest(request, env);

    const attestationToken = zipAndEncodeToBase64(attestation);

    // console.log('apiresponse', JSON.stringify(attestationToken));

    return new Response({ attestationToken } as unknown as string, {});
  },
};
