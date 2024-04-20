import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';

export type TranslationAttestationSchemaData = {
  sourceId: string;
  sourceStringId: string;
  translatedStringId: string;
  score: number;
  version?: number;
};

export const TRANSLATION_ATTESTATION_SCHEMA =
  'string s, string l, string t, uint8 s, uint8 v';

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
    { name: 's', value: sourceId, type: 'string' },
    { name: 'l', value: sourceStringId, type: 'string' },
    { name: 't', value: translatedStringId, type: 'string' },
    { name: 's', value: score, type: 'uint8' },
    { name: 'v', value: version, type: 'uint8' },
  ]);
};
