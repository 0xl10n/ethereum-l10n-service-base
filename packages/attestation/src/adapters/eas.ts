import { SignedOffchainAttestation } from '@ethereum-attestation-service/eas-sdk';

(BigInt.prototype as any).toJSON = function () {
  // TODO: if the number is too large, it should not be casted as integer
  return parseInt(this);
};

export const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'; // Sepolia v0.26

export interface Attestation {
  signer: string;
  sig: SignedOffchainAttestation;
}
