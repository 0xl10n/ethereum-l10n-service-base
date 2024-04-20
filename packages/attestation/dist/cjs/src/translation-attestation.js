"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eas_sdk_1 = require("@ethereum-attestation-service/eas-sdk");
const ethers_1 = require("ethers");
class TranslationAttestation {
    constructor(ethNetwork, alchemyAPIKey, walletPrivateKey, schemaUid, schemaRegistryContractAddress, easContractAddress, recipientAddress) {
        this.provider = new ethers_1.ethers.AlchemyProvider(ethNetwork, alchemyAPIKey);
        this.signer = new ethers_1.ethers.Wallet(walletPrivateKey, this.provider);
        this.schema = "string v, string l, string t, uint8 s";
        this.schemaUid = schemaUid;
        this.schemaRegistryContractAddress = schemaRegistryContractAddress;
        this.easContractAddress = easContractAddress;
        this.recipientAddress = recipientAddress;
    }
    async ping() {
        console.log('pong');
        return 'pong';
    }
    async createSchema() {
        const schemaRegistryContractAddress = this.schemaRegistryContractAddress;
        const schemaRegistry = new eas_sdk_1.SchemaRegistry(schemaRegistryContractAddress);
        schemaRegistry.connect(this.signer);
        const revocable = true;
        const schema = this.schema;
        const transaction = await schemaRegistry.register({
            schema,
            revocable,
        });
        const newSchemaID = await transaction.wait();
        console.log(newSchemaID);
        return newSchemaID;
    }
    async attestTranslationOnChain(score, videoId, lineId, translatedLineId) {
        console.log('attesting translation onchain');
        const EASContractAddress = this.easContractAddress;
        const eas = new eas_sdk_1.EAS(EASContractAddress);
        eas.connect(this.signer);
        const schemaEncoder = new eas_sdk_1.SchemaEncoder(this.schema);
        const encodedData = schemaEncoder.encodeData([
            { name: "v", value: videoId, type: "string" },
            { name: "l", value: lineId, type: "string" },
            { name: "t", value: translatedLineId, type: "string" },
            { name: "s", value: score, type: "uint8" },
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
    async attestTranslationOffChain(score, videoId, lineId, translatedLineId) {
        console.log('attesting translation offchain');
        console.log('videoId:', videoId);
        console.log('lineId:', lineId);
        console.log('translatedLineId:', translatedLineId);
        console.log('score:', score);
        const EASContractAddress = this.easContractAddress;
        const eas = new eas_sdk_1.EAS(EASContractAddress);
        eas.connect(this.signer);
        console.log(this.signer.address);
        const offchain = await eas.getOffchain();
        const schemaEncoder = new eas_sdk_1.SchemaEncoder(this.schema);
        const encodedData = schemaEncoder.encodeData([
            { name: "v", value: videoId, type: "string" },
            { name: "l", value: lineId, type: "string" },
            { name: "t", value: translatedLineId, type: "string" },
            { name: "s", value: score, type: "uint8" },
        ]);
        const offchainAttestation = await offchain.signOffchainAttestation({
            schema: this.schemaUid,
            recipient: this.recipientAddress,
            time: BigInt(Math.floor(Date.now() / 1000)),
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
            },
            'signer': this.signer.address,
        };
        console.log('attestation:', attestation);
        return attestation;
    }
    async verifyTranslationAttestation(attestation) {
        const EAS_CONFIG = {
            address: attestation.sig.domain.verifyingContract,
            version: attestation.sig.domain.version,
            chainId: attestation.sig.domain.chainId,
        };
        const EASContractAddress = this.easContractAddress;
        const eas = new eas_sdk_1.EAS(EASContractAddress);
        eas.connect(this.signer);
        const offchain = new eas_sdk_1.Offchain(EAS_CONFIG, eas_sdk_1.OffchainAttestationVersion.Version2, eas);
        const isValidAttestation = offchain.verifyOffchainAttestationSignature(attestation.signer, attestation.sig);
        console.log('isValidAttestation:', isValidAttestation);
        return isValidAttestation;
    }
}
exports.default = TranslationAttestation;
//# sourceMappingURL=translation-attestation.js.map