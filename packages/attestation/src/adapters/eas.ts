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
