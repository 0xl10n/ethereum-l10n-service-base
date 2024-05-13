import { describe, it, expect } from 'vitest';
import { createAttestation, queryAttestation, querySmoke } from './attestation';

describe('graphql', () => {
  it('#queryAttestation', async () => {
    const fixtureId =
      'kjzl6kcym7w8y8hz2ihj4fqx2epofcektj0ab0wdf6axoq2b74v0mer3t2imv7n';
    const results = await queryAttestation(fixtureId);
    const attestation = results?.data?.node;
    console.log('results', results);
    expect(attestation.attestor).toEqual('0x12345');
  });

  it('#createTranslationAttestation', async () => {
    const results = await createAttestation({
      attestor: '0x12345',
      recipient: '0x456',
      uid: '0x04d2b4a944c95ca885b8678771451d665ae88ec5b67764b0932db9748bae30ee',
      // sourceId: 'youtube-Ouml0A3UmLY',
      sourceStringId: 'youtube-Ouml0A3UmLY-en-0',
      translatedStringId: 'youtube-Ouml0A3UmLY-en-zh-TW-0',
      // score: 35,
      time: new Date(),
      // data: 'eNrFVEuKXDEMvMtbN8H6y8ue7p5LhCwsWT5ASCDHH78Zss%2FQCfHCxuCqUhmVvh7tC%2BpxAQCRvV2O9uuGan293MmmMLnfiju9wv3FhLDdkbTAQeo4H1vmkoTsnNZctGI2Ki8cDNZgUms6TBeMgjG1g9cKpGk8rUaMDxJJmhhAXpTLTbPGmsNysvocqZmbLSB5BBlZn8VajKKgJUXHBf3kAbi%2BVhO6ZQNKdmrXQdHh8chwVmqZj%2BSrv4s23pI8OnN2yeEu4WpuBiwwVWWUe6WEmilH64QzurHHKGr1YX%2FmAhKj7Lq0hkWSyORh6D0W04xtOPD0sD%2B1ADM22YiMwH3q8bmywUCUYFNc2kYelx%2Fff9a7mafWeA7e6jk44JP6Df4vHnZL6jIxNlFUwcn7plOTGgPtltDJKb39owX%2BZ%2Fo4dScUz1D%2BXf36nL4NddzDRex3LcfuZzwbuTDajnTTGMSr0RlDI96jYAcTAzvS6GYDN9JmoGASOtbJvEOsx7c3vRUYTw%3D%3D',
    });
    console.log('results', results);
    const id = results?.data?.createTranslationAttestation?.document?.id;
    console.log('id', id);
    expect(!!id).toEqual(true);
  });

  it('#querySmoke', async () => {
    const { data } = await querySmoke();
    expect(!!(data?.viewer?.id || '').match(/did/)).toEqual(true);
  });
});
