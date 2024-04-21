import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
  Offchain,
  OffchainAttestationVersion,
  SignedOffchainAttestation,
} from '@ethereum-attestation-service/eas-sdk';

import { ethers } from 'ethers';
import { Attestation } from '../adapters/eas';

(BigInt.prototype as any).toJSON = function () {
  // TODO: if the number is too large, it should not be casted as integer
  return parseInt(this);
};

export default class Attestor {
  private readonly signer: ethers.Signer;
  private readonly schema: string;
  private schemaUid: string;
  private readonly schemaRegistryContractAddress: string;
  private readonly easContractAddress: string;
  private readonly recipientAddress: string;

  constructor(
    signer: ethers.Signer,
    schema: string,
    schemaRegistryContractAddress: string,
    easContractAddress: string,
    recipientAddress: string,
    schemaUid?: string,
  ) {
    this.signer = signer;
    this.schema = schema;
    this.schemaRegistryContractAddress = schemaRegistryContractAddress;
    this.easContractAddress = easContractAddress;
    this.recipientAddress = recipientAddress;
    this.schemaUid = schemaUid;
  }

  async registerSchema(): Promise<any> {
    const schemaRegistryContractAddress: string =
      this.schemaRegistryContractAddress;
    const schemaRegistry: SchemaRegistry = new SchemaRegistry(
      schemaRegistryContractAddress,
    );
    schemaRegistry.connect(this.signer);

    const revocable: boolean = true;
    const schema = this.schema;
    const transaction = await schemaRegistry.register({
      schema,
      revocable,
    });
    const newSchemaID: string = await transaction.wait();
    console.log(newSchemaID);
    this.schemaUid = newSchemaID;
    return newSchemaID;
  }

  async attestOnChain(encodedData: string, score: number): Promise<any> {
    console.log('attesting translation onchain');
    const EASContractAddress = this.easContractAddress;

    const eas = new EAS(EASContractAddress);
    eas.connect(this.signer);

    const tx = await eas.attest({
      schema: this.schemaUid,
      data: {
        data: encodedData,
        expirationTime: 0n,
        recipient: this.recipientAddress,
        revocable: true,
      },
    });

    const newAttestationUID = await tx.wait();

    console.log('New attestation UID:', newAttestationUID);
  }

  async attestOffChain(
    encodedData: string,
    responseAsText: boolean = false,
    refUID: string = '0x0000000000000000000000000000000000000000000000000000000000000000',
  ): Promise<Attestation | string> {
    const EASContractAddress = this.easContractAddress;
    const eas = new EAS(EASContractAddress);
    eas.connect(this.signer);
    const offchain = await eas.getOffchain();

    console.log({
      schema: this.schemaUid,
      recipient: this.recipientAddress,
      time: BigInt(Math.floor(Date.now() / 1000)),
      expirationTime: 0n,
      revocable: true,
      refUID: refUID,
      data: encodedData,
    });
    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        schema: this.schemaUid,
        recipient: this.recipientAddress,
        time: BigInt(Math.floor(Date.now() / 1000)),
        expirationTime: 0n,
        revocable: true,
        refUID: refUID,
        data: encodedData,
      },
      this.signer,
    );

    let attestation = {
      sig: {
        domain: offchainAttestation.domain,
        primaryType: offchainAttestation.primaryType,
        types: offchainAttestation.types,
        signature: offchainAttestation.signature,
        uid: offchainAttestation.uid,
        message: offchainAttestation.message,
        version: offchainAttestation.version,
      },
      signer: await this.signer.getAddress(),
    };

    if (responseAsText) {
      return JSON.stringify(attestation);
    }

    return attestation;
  }

  async verify(attestation: Attestation): Promise<boolean> {
    const EAS_CONFIG = {
      address: attestation.sig.domain.verifyingContract,
      version: attestation.sig.domain.version,
      chainId: attestation.sig.domain.chainId,
    };

    const EASContractAddress = attestation.sig.domain.verifyingContract;
    const eas = new EAS(EASContractAddress);
    const offchain = new Offchain(EAS_CONFIG, attestation.sig.version, eas);
    let isValidAttestation = false;
    try {
      isValidAttestation = offchain.verifyOffchainAttestationSignature(
        attestation.signer,
        attestation.sig,
      );
    } catch (e) {
      console.error(e);
    }

    console.log('isValidAttestation:', isValidAttestation);

    return isValidAttestation;
  }

  async verifyAttestationStr(attestationStr: string): Promise<boolean> {
    const attestationObj = JSON.parse(attestationStr);
    const attestation: Attestation = {
      signer: attestationObj.signer,
      sig: {
        domain: {
          chainId: BigInt(attestationObj.sig.domain.chainId),
          name: attestationObj.sig.domain.name,
          verifyingContract: attestationObj.sig.domain.verifyingContract,
          version: attestationObj.sig.domain.version,
        },
        primaryType: attestationObj.sig.primaryType,
        types: attestationObj.sig.types,
        signature: attestationObj.sig.signature,
        uid: attestationObj.sig.uid,
        message: {
          recipient: attestationObj.sig.message.recipient,
          schema: attestationObj.sig.message.schema,
          time: BigInt(attestationObj.sig.message.time),
          expirationTime: BigInt(attestationObj.sig.message.expirationTime),
          refUID: attestationObj.sig.message.refUID,
          data: attestationObj.sig.message.data,
          revocable: attestationObj.sig.message.revocable,
          salt: attestationObj.sig.message.salt,
          version: attestationObj.sig.message.version,
        },
        version: attestationObj.sig.version,
      },
    };

    return this.verify(attestation);
  }
}
