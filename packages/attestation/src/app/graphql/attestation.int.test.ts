import { describe, it, expect } from 'vitest';
import { createAttestation, queryAttestation, querySmoke } from './attestation';

describe('graphql', () => {
  it('#queryAttestation', async () => {
    const fixtureId =
      'kjzl6kcym7w8y9kvknpfumjvma2uhoeedgu87qdqrbxea5tmolxzxm7dvxbficu';
    const results = await queryAttestation(fixtureId);
    const attestation = results?.data?.node;
    expect(attestation.attestor).toEqual('0x12345');
  });

  it('#createAttestation', async () => {
    const results = await createAttestation({
      attestor: '0x12345',
      recipient: '0x456',
    });
    const id = results?.data?.createAttestation?.document?.id;
    console.log('id', id);
    expect(!!id).toEqual(true);
  });

  it('#querySmoke', async () => {
    const { data } = await querySmoke();
    expect(!!(data?.viewer?.id || '').match(/did/)).toEqual(true);
  });
});
