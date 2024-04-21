export { default as TranslationAttestation } from './src/app/attestor';
// export { Attestor } from './src/app/attestor';

export { default as Attestor } from './src/app/attestor';

export {
  TRANSLATION_ATTESTATION_SCHEMA,
  encodeTranslationAttestationSchema,
  TRANSLATION_SCHEMA_UID,
} from './src/domain/schemas/translation-attestation';

export {
  CONTRIBUTION_ATTESTATION_SCHEMA,
  encodeContributionAttestationSchema,
  CONTRIBUTION_SCHEMA_UID,
} from './src/domain/schemas/contribution-attestation';

export {
  EAS_CONTRACT_ADDRESS,
  SCHEMA_REGISTRY_CONTRACT_ADDRESS,
} from './src/adapters/eas';

export {
  Attestation,
  EAS,
  SchemaEncoder,
  SchemaRegistry,
  Offchain,
  OffchainAttestationVersion,
  SignedOffchainAttestation,
} from '@ethereum-attestation-service/eas-sdk';
