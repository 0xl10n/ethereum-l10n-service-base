"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttestationsController = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const attestation_1 = require("@repo/attestation");
require("dotenv/config");
const lighthouse_1 = require("lighthouse");
const witness_1 = require("witness");
BigInt.prototype.toJSON = function () {
    // TODO: if the number is too large, it should not be casted as integer
    return parseInt(this);
};
let AttestationsController = (() => {
    let _classDecorators = [(0, common_1.Controller)('attestations')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _findAll_decorators;
    let _create_decorators;
    var AttestationsController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _findAll_decorators = [(0, common_1.Get)()];
            _create_decorators = [(0, common_1.Post)()];
            __esDecorate(this, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AttestationsController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        async findAll(res) {
            const recipientAddress = process.env.RECIPIENT_ADDRESS;
            const schemaRegistryContractAddress = process.env.SCHEMA_REGISTRY_CONTRACT_ADDRESS;
            const provider = new ethers_1.ethers.AlchemyProvider(process.env.ETH_NETWORK, process.env.ALCHEMY_API_KEY);
            const signer = new ethers_1.ethers.Wallet(process.env.ATTESTOR_WALLET_PRIVATE_KEY, provider);
            const easContractAddress = process.env.EAS_CONTRACT_ADDRESS;
            const schemaUid = process.env.SCHEMA_UID;
            const refUID = process.env.REF_UID;
            console.log(refUID);
            const data = {
                sourceId: 'youtube-a',
                sourceStringId: 'string-1',
                translatedStringId: 'string-2',
                score: 90,
            };
            const encodedData = (0, attestation_1.encodeTranslationAttestationSchema)(data);
            const attestor = new attestation_1.Attestor(signer, attestation_1.TRANSLATION_ATTESTATION_SCHEMA, schemaRegistryContractAddress, easContractAddress, recipientAddress, schemaUid);
            // TODO take in attesation for storage
            const attestationStr = await attestor.attestOffChain(encodedData, refUID);
            const verifiedStr = await attestor.verify(attestationStr);
            console.log(verifiedStr);
            // const attestation = await attestor.attestOffChain(
            //   encodedData,
            //   false,
            //   refUID,
            // );
            // const verified = await attestor.verify(attestation);
            // console.log(verified);
            // const attestationStr = await attestor.attestOffChain(
            //   encodedData,
            //   true,
            //   refUID,
            // );
            // const verifiedStr = await attestor.verifyAttestationStr(attestationStr);
            // console.log(verifiedStr);
            (0, lighthouse_1.uploadText)('Hello World', process.env.LIGHTHOUSE_API_KEY);
            // let witness = new Witness();
            // witness.ping();
            // let proof = await witness.witness('Hello World');
            // console.log(proof);
            return res.status(common_1.HttpStatus.OK).json({
                message: 'pong',
                // attestation: attestation,
                // verified: verified,
                // attestationStr: attestationStr,
                // verifiedStr: verifiedStr,
            });
        }
        async create(createAttestationDto, res) {
            // validate the input
            if (createAttestationDto.sig === undefined ||
                createAttestationDto.signer === undefined) {
                res
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .json({ message: 'sig and signer are required' });
            }
            // convert the attestationDto to a string
            // TODO: wrapper for json object to attestation
            const attestationStr = JSON.stringify(createAttestationDto);
            const recipientAddress = process.env.RECIPIENT_ADDRESS;
            const schemaRegistryContractAddress = process.env.SCHEMA_REGISTRY_CONTRACT_ADDRESS;
            const provider = new ethers_1.ethers.AlchemyProvider(process.env.ETH_NETWORK, process.env.ALCHEMY_API_KEY);
            const signer = new ethers_1.ethers.Wallet(process.env.ATTESTOR_WALLET_PRIVATE_KEY, provider);
            const easContractAddress = process.env.EAS_CONTRACT_ADDRESS;
            const schemaUid = process.env.SCHEMA_UID;
            const attestor = new attestation_1.Attestor(signer, attestation_1.TRANSLATION_ATTESTATION_SCHEMA, schemaRegistryContractAddress, easContractAddress, recipientAddress, schemaUid);
            // verify the attestation
            const verified = await attestor.verify(attestationStr);
            if (!verified) {
                return res
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .json({ message: 'Attestation is not valid' });
            }
            // if the attestation is valid, store it in IPFS
            const storedObj = await (0, lighthouse_1.uploadText)(JSON.stringify(createAttestationDto), process.env.LIGHTHOUSE_API_KEY);
            // witness the attestation
            const witness = new witness_1.Witness();
            const proof = await witness.witness(JSON.stringify(createAttestationDto));
            // return the response
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Attestation is valid',
                cid: storedObj.cid,
                proof: proof,
            });
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    return AttestationsController = _classThis;
})();
exports.AttestationsController = AttestationsController;
