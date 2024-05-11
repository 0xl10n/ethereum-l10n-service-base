"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttestButtonGroup = void 0;
const lodash_1 = __importDefault(require("lodash"));
const subs_1 = require("@repo/subs");
const WalletContext_1 = require("./WalletContext");
const attestation_1 = require("@repo/attestation");
const TranslationContext_1 = require("./TranslationContext");
const solid_js_1 = require("solid-js");
const store_1 = require("solid-js/store");
const AttestButtonGroup = () => {
    const [store, setStore] = (0, store_1.createStore)({
        attestation: null
    });
    const videoId = 'Ouml0A3UmLY';
    const sourceId = 'youtube-' + videoId;
    const { localeStore } = (0, TranslationContext_1.useTranslationContext)();
    const { fromLocale, toLocale } = localeStore;
    // const [attestation, setAttestation] = createSignal<Attestation>(null)
    const { signer } = (0, WalletContext_1.useWalletContext)();
    // TODO
    const attestorAddress = '0x11AFe053Cc013c4830Aa3b91EEcb84630ccEc4A8';
    const { activeCue } = (0, TranslationContext_1.useTranslationContext)();
    const attest = (cue, score, id) => {
        const attestor = new attestation_1.Attestor(signer, attestation_1.TRANSLATION_ATTESTATION_SCHEMA, attestation_1.SCHEMA_REGISTRY_CONTRACT_ADDRESS, attestation_1.EAS_CONTRACT_ADDRESS, attestorAddress, attestation_1.TRANSLATION_SCHEMA_UID);
        const cueId = cue.id || id;
        const data = {
            sourceId,
            sourceStringId: (0, subs_1.createSourceStringId)(sourceId, fromLocale, cueId),
            translatedStringId: (0, subs_1.createTranslationStringId)(sourceId, fromLocale, toLocale, cueId),
            score,
            version: 1
        };
        const encodedData = (0, attestation_1.encodeTranslationAttestationSchema)(data);
        attestor.attestOffChain(encodedData)
            .then((attestationResult) => {
            console.log('attestation', attestationResult);
            setStore("attestation", () => {
                return attestationResult;
            });
        });
    };
    const encodedAttestation = (0, solid_js_1.createMemo)(() => {
        if (store?.attestation?.sig?.uid) {
            return encodeURIComponent((0, attestation_1.zipAndEncodeToBase64)(store.attestation));
        }
        return '';
    });
    const uid = (0, solid_js_1.createMemo)(() => {
        return (store.attestation?.sig?.uid || '');
    });
    return (<div class="text-xl">
            <div class="flex flex-col">
                <div class="flex flex-row content-center items-center pr-3">
                    Translation Id: &nbsp;
                    <div class="badge badge-primary text-sm px-4">

                        {(0, subs_1.createTranslationStringId)(sourceId, fromLocale, toLocale, activeCue().id)}
                    </div>
                </div>
                <div class="flex flex-row w-full py-4">
                    <div class="relative mr-5"><button onClick={() => attest(activeCue, 1, 0)} class="btn btn-outline text-white">👍</button></div>
                    <div class="relative ml-5"><button onClick={() => attest(activeCue, -1, 0)} class="btn btn-outline text-white">👎</button></div>
                </div>
                <div class="flex flex-row">
                    <div>
                        {store.attestation && (<div class="relative w-full">
                                    ☑️ Attested
                                    <br />
                                    <a target="_blank" href={"https://sepolia.easscan.org/offchain/url/#attestation=" + encodedAttestation()}>
                                        {lodash_1.default.truncate(uid(), { length: 10 })}
                                    </a>

                                </div>)}
                    </div>
                </div>



            </div>
        </div>);
};
exports.AttestButtonGroup = AttestButtonGroup;
