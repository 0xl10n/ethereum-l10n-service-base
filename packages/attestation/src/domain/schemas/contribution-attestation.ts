import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';

/**
 * TODO decide whether we apply builtin receipent as contributor / protocol contract
 * we should link contributions (translation attestations) under same source to be refIds
 */

export type ContributionAttestationSchemaData = {
  sourceId: string;
  allocation: number;
  version?: number;
  // TODO: refId
};

export const CONTRIBUTION_ATTESTATION_SCHEMA =
  'string sourceId, uint8 allocation, uint8 version';

export const encodeContributionAttestationSchema = (
  data: ContributionAttestationSchemaData,
) => {
  const schemaEncoder = new SchemaEncoder(CONTRIBUTION_ATTESTATION_SCHEMA);

  const { sourceId, allocation, version = 1 } = data;
  return schemaEncoder.encodeData([
    { name: 'sourceId', value: sourceId, type: 'string' },
    { name: 'allocation', value: allocation, type: 'uint8' },
    { name: 'version', value: version, type: 'uint8' },
  ]);
};

export const CONTRIBUTION_SCHEMA_UID =
  '0xc9373310b63806678e86513c31bd1df74919ed8ad24ba931000566c1acea9416';
