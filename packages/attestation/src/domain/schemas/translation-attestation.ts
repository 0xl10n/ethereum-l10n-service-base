import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';

export type TranslationAttestationSchemaData = {
  sourceId: string;
  sourceStringId: string;
  translatedStringId: string;
  score: number;
  version?: number;
};

export const TRANSLATION_ATTESTATION_SCHEMA =
  'string sourceId, string sourceStringId, string translatedStringId, uint8 score, uint8 version';

export const encodeTranslationAttestationSchema = (
  data: TranslationAttestationSchemaData,
) => {
  const schemaEncoder = new SchemaEncoder(TRANSLATION_ATTESTATION_SCHEMA);

  const {
    sourceId,
    sourceStringId,
    translatedStringId,
    score,
    version = 1,
  } = data;

  return schemaEncoder.encodeData([
    { name: 'sourceId', value: sourceId, type: 'string' },
    { name: 'sourceStringId', value: sourceStringId, type: 'string' },
    { name: 'translatedStringId', value: translatedStringId, type: 'string' },
    { name: 'score', value: score, type: 'uint8' },
    { name: 'version', value: version, type: 'uint8' },
  ]);
};

export const TRANSLATION_SCHEMA_UID =
  '0xdcf13573c96f6ea7bc355d4a7289bf43db18eb2dac6679e12cb764abcbb264a6';
