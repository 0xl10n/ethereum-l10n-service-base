import { SignedOffchainAttestation } from '@ethereum-attestation-service/eas-sdk';

(BigInt.prototype as any).toJSON = function () {
  // TODO: if the number is too large, it should not be casted as integer
  return parseInt(this);
};

export interface Attestation {
  signer: string;
  sig: SignedOffchainAttestation;
}

// https://docs.attest.sh/docs/quick--start/contracts

export const EAS_CONTRACT_ADDRESS =
  process.env.EAS_CONTRACT_ADDRESS ||
  '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'; // Sepolia v0.26

export const SCHEMA_REGISTRY_CONTRACT_ADDRESS =
  process.env.SCHEMA_REGISTRY_CONTRACT_ADDRESS ||
  '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0';
