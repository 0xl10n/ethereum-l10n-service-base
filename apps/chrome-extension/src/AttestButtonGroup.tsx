import _ from 'lodash';
import { Locale, NAME_BY_LOCALE, createSourceStringId, createTranslationStringId } from '@repo/subs';
import { useWalletContext } from './WalletContext';
import {
    Attestor,
    encodeTranslationAttestationSchema,
    TRANSLATION_ATTESTATION_SCHEMA, SCHEMA_REGISTRY_CONTRACT_ADDRESS, EAS_CONTRACT_ADDRESS,
    TRANSLATION_SCHEMA_UID,
    Attestation,
    SignedOffchainAttestation,
    zipAndEncodeToBase64
} from '@repo/attestation'
import { useTranslationContext } from './TranslationContext';
import { createMemo, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

export const AttestButtonGroup = () => {
    const [store, setStore] = createStore({
        attestation: null

    })
    const videoId = 'Ouml0A3UmLY';
    const sourceId = 'youtube-' + videoId;

    const { localeStore } = useTranslationContext()
    const { fromLocale, toLocale } = localeStore

    // const [attestation, setAttestation] = createSignal<Attestation>(null)

    const { signer } = useWalletContext();

    console.log('wallet context', signer());
    // TODO
    const attestorAddress = '0x11AFe053Cc013c4830Aa3b91EEcb84630ccEc4A8';


    const { activeCue } = useTranslationContext();

    const attest = (cue: VTTCue, score: number, id: number) => {
        console.log('attest', signer())
        if (!signer()) {
            console.log('signer missing')
            return;
        }
        const attestor = new Attestor(
            signer(),
            TRANSLATION_ATTESTATION_SCHEMA,
            SCHEMA_REGISTRY_CONTRACT_ADDRESS, EAS_CONTRACT_ADDRESS, attestorAddress,
            TRANSLATION_SCHEMA_UID
        );
        const cueId = cue.id || id
        const data = {
            sourceId,
            sourceStringId: createSourceStringId(sourceId, fromLocale, cueId),
            translatedStringId: createTranslationStringId(sourceId, fromLocale, toLocale, cueId),
            score,
            version: 1
        };

        const encodedData = encodeTranslationAttestationSchema(
            data
        )

        attestor.attestOffChain(encodedData)
            .then((attestationResult) => {
                console.log('attestation', attestationResult)
                setStore("attestation", () => {
                    return attestationResult
                })

            })
    }

    const encodedAttestation = createMemo(() => {
        if (store?.attestation?.sig?.uid) {
            return encodeURIComponent(zipAndEncodeToBase64(store.attestation))
        }
        return ''
    })

    const uid = createMemo(() => {
        return (store.attestation?.sig?.uid || '')
    })

    return (
        <div class="text-xl" >
            <div class="flex flex-col">
                <div class="flex flex-row content-center items-center pr-3">
                    Translation: &nbsp;
                    <div class="badge badge-primary text-sm px-4">
                        {createTranslationStringId(sourceId, fromLocale, toLocale, activeCue().id)}
                    </div>
                </div>
                <div class="flex flex-row w-full py-4">
                    <div class="relative mr-5"><button onClick={() => attest(activeCue, 1, 0)}
                        class="btn btn-outline text-white">👍</button></div>
                    <div class="relative ml-5"><button onClick={() => attest(activeCue, -1, 0)}
                        class="btn btn-outline text-white">👎</button></div>
                </div>
                <div class="flex flex-row">
                    <div >
                        {
                            store.attestation && (
                                <div class="toast toast-end">
                                    <div class="alert alert-success relative w-full mb-10">
                                        ☑️ Attested
                                        <br />
                                        <a target="_blank" href={"https://sepolia.easscan.org/offchain/url/#attestation=" + encodedAttestation()}>
                                            {_.truncate(uid(), { length: 10 })}
                                        </a>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>



            </div>
        </div >
    )
}