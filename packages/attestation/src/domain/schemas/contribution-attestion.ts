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

export const CONTRIBUTION_ATTESTATION_SCHEMA = 'string s, uint8 a,  uint8 v';

export const encodeContributionAttestationSchema = (
  data: ContributionAttestationSchemaData,
) => {
  const schemaEncoder = new SchemaEncoder(CONTRIBUTION_ATTESTATION_SCHEMA);

  const { sourceId, allocation, version } = data;
  return schemaEncoder.encodeData([
    { name: 's', value: sourceId, type: 'string' },
    { name: 'a', value: allocation, type: 'uint8' },
    { name: 'v', value: version, type: 'uint8' },
  ]);
};
