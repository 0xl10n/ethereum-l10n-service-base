import {SignedOffchainAttestation} from "@ethereum-attestation-service/eas-sdk";

export class CreateAttestationDto {
  sig: SignedOffchainAttestation;
  signer: string;
}
