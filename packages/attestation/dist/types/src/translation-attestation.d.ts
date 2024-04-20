import { SignedOffchainAttestation } from "@ethereum-attestation-service/eas-sdk";
interface Attestation {
    signer: string;
    sig: SignedOffchainAttestation;
}
export default class TranslationAttestation {
    private readonly provider;
    private readonly signer;
    private readonly schema;
    private readonly schemaUid;
    private readonly schemaRegistryContractAddress;
    private readonly easContractAddress;
    private readonly recipientAddress;
    constructor(ethNetwork: string, alchemyAPIKey: string, walletPrivateKey: string, schemaUid: string, schemaRegistryContractAddress: string, easContractAddress: string, recipientAddress: string);
    ping(): Promise<any>;
    createSchema(): Promise<any>;
    attestTranslationOnChain(score: number, videoId: string, lineId: string, translatedLineId: string): Promise<any>;
    attestTranslationOffChain(score: number, videoId: string, lineId: string, translatedLineId: string): Promise<any>;
    verifyTranslationAttestation(attestation: Attestation): Promise<any>;
}
export {};
