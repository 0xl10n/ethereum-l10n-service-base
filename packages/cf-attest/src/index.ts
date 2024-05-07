import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
  Offchain,
  OffchainAttestationVersion,
  SignedOffchainAttestation,
} from '@ethereum-attestation-service/eas-sdk';

import { ethers, Wallet } from 'ethers';

import {
  TRANSLATION_ATTESTATION_SCHEMA,
  encodeTranslationAttestationSchema,
  Attestor,
} from '@repo/attestation';

export interface Env {
  TEST_WALLET_PRIVATE_KEY: string;
  ALCHEMY_API_KEY: string;
  ENVIRONMENT: string;
}
// const TRANSLATION_ATTESTATION_SCHEMA =
//   'string sourceId, string sourceStringId, string translatedStringId, uint8 score, uint8 version';
// const encodeTranslationAttestationSchema = (data) => {
//   const schemaEncoder = new SchemaEncoder(TRANSLATION_ATTESTATION_SCHEMA);

//   const {
//     sourceId,
//     sourceStringId,
//     translatedStringId,
//     score,
//     version = 1,
//   } = data;

//   console.log(data);

//   return schemaEncoder.encodeData([
//     { name: 'sourceId', value: sourceId, type: 'string' },
//     { name: 'sourceStringId', value: sourceStringId, type: 'string' },
//     { name: 'translatedStringId', value: translatedStringId, type: 'string' },
//     { name: 'score', value: score, type: 'uint8' },
//     { name: 'version', value: version, type: 'uint8' },
//   ]);
// };

const TRANSLATION_SCHEMA_UID =
  '0xdcf13573c96f6ea7bc355d4a7289bf43db18eb2dac6679e12cb764abcbb264a6';

async function handleRequest(request: Request, env: Env) {
  const url = new URL(request.url);

  console.log('ENVIRONMENT', env.ENVIRONMENT);

  const network = 'sepolia';

  const apiKey = env.ALCHEMY_API_KEY;

  const EAS_CONTRACT_ADDRESS = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';

  const easContractAddress = EAS_CONTRACT_ADDRESS;

  const SCHEMA_REGISTRY_CONTRACT_ADDRESS =
    '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0';
  const eas = new EAS(EAS_CONTRACT_ADDRESS);

  // await attestor.registerSchema();

  const recipientAddress = '0x9FaD3583CBa4A1edF511A589f215A87B524D83e7';
  // const schemaRegistryContractAddress =
  //   process.env.SCHEMA_REGISTRY_CONTRACT_ADDRESS;
  const provider = new ethers.AlchemyProvider(network, apiKey);

  const signer = new Wallet(env.TEST_WALLET_PRIVATE_KEY, provider);
  eas.connect(signer);
  const offchain = await eas.getOffchain();

  const data = {
    sourceId: 'youtube-a',
    sourceStringId: 'string-1',
    translatedStringId: 'string-2',
    score: 90,
  };

  const encodedData = encodeTranslationAttestationSchema(data);

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

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    let apiResponse = await handleRequest(request, env);
    console.log('apiresponse', JSON.stringify(apiResponse));

    return new Response(apiResponse.sig.domain?.name as unknown as string, {});
  },
};
