import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
  Offchain,
  OffchainAttestationVersion,
  SignedOffchainAttestation
} from "@ethereum-attestation-service/eas-sdk";

import {ethers} from "ethers";

(BigInt.prototype as any).toJSON = function () {
  // TODO: if the number is too large, it should not be casted as integer
  return parseInt(this);
};

export interface Attestation {
  signer: string;
  sig: SignedOffchainAttestation;
}

export default class TranslationAttestation {
  private readonly provider;
  private readonly signer: ethers.Wallet;
  private readonly schema: string;
  private readonly schemaUid: string;
  private readonly schemaRegistryContractAddress: string;
  private readonly easContractAddress: string;
  private readonly recipientAddress: string;

  constructor(ethNetwork: string,
              alchemyAPIKey: string,
              walletPrivateKey: string,
              schemaUid: string,
              schemaRegistryContractAddress: string,
              easContractAddress: string,
              recipientAddress: string) {
    this.provider = new ethers.AlchemyProvider(ethNetwork, alchemyAPIKey);
    this.signer = new ethers.Wallet(walletPrivateKey, this.provider);
    this.schema = "string v, string l, string t, uint8 s";
    this.schemaUid = schemaUid;
    this.schemaRegistryContractAddress = schemaRegistryContractAddress;
    this.easContractAddress = easContractAddress;
    this.recipientAddress = recipientAddress;
  }

  async ping(): Promise<any> {
    console.log('pong');
    return 'pong';
  }

  async createSchema() : Promise<any> {
    const schemaRegistryContractAddress: string = this.schemaRegistryContractAddress;
    const schemaRegistry: SchemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
    schemaRegistry.connect(this.signer);

    const revocable: boolean = true;
    const schema = this.schema;
    const transaction = await schemaRegistry.register({
      schema,
      revocable,
    });
    const newSchemaID: string = await transaction.wait();
    console.log(newSchemaID);
    return newSchemaID;
  }

  async attestTranslationOnChain(score: number, videoId: string, lineId: string, translatedLineId: string) : Promise<any> {
    console.log('attesting translation onchain');
    const EASContractAddress = this.easContractAddress;

    const eas = new EAS(EASContractAddress);
    eas.connect(this.signer);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(this.schema);
    const encodedData = schemaEncoder.encodeData([
      {name: "v", value: videoId, type: "string"},
      {name: "l", value: lineId, type: "string"},
      {name: "t", value: translatedLineId, type: "string"},
      {name: "s", value: score, type: "uint8"},
    ]);

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

    console.log("New attestation UID:", newAttestationUID);
  }

  async attestTranslationOffChain(score: number, videoId: string, lineId: string, translatedLineId: string, responseAsText: boolean = false) : Promise<any> {
    const EASContractAddress = this.easContractAddress;
    const eas = new EAS(EASContractAddress);
    eas.connect(this.signer);
    const offchain = await eas.getOffchain();
    const schemaEncoder = new SchemaEncoder(this.schema);

    const encodedData = schemaEncoder.encodeData([
      {name: "v", value: videoId, type: "string"},
      {name: "l", value: lineId, type: "string"},
      {name: "t", value: translatedLineId, type: "string"},
      {name: "s", value: score, type: "uint8"},
    ]);

    const offchainAttestation = await offchain.signOffchainAttestation({
      schema: this.schemaUid,
      recipient: this.recipientAddress,
      time: BigInt(Math.floor(Date.now()/1000)),
      expirationTime: 0n,
      revocable: true,
      refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
      data: encodedData,
    }, this.signer);

    let attestation = {
      'sig': {
        'domain': offchainAttestation.domain,
        'primaryType': offchainAttestation.primaryType,
        'types': offchainAttestation.types,
        'signature': offchainAttestation.signature,
        'uid': offchainAttestation.uid,
        'message': offchainAttestation.message,
        'version': offchainAttestation.version,
      },
      'signer': this.signer.address,
    };

    if (responseAsText) {
      return JSON.stringify(attestation);
    }

    return attestation;
  }

  async verifyTranslationAttestation(attestation: Attestation) : Promise<any> {
    const EAS_CONFIG = {
      address: attestation.sig.domain.verifyingContract,
      version: attestation.sig.domain.version,
      chainId: attestation.sig.domain.chainId,
    };

    const EASContractAddress = this.easContractAddress;
    const eas = new EAS(EASContractAddress);
    const offchain = new Offchain(EAS_CONFIG, attestation.sig.version, eas);
    let isValidAttestation = false;

    try {
       isValidAttestation = offchain.verifyOffchainAttestationSignature(
          attestation.signer,
          attestation.sig
      );
    } catch(e) {
        console.error(e);
    }

    console.log('isValidAttestation:', isValidAttestation);

    return isValidAttestation;
  }
}
