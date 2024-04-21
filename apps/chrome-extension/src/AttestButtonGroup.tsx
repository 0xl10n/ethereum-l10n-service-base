import { Locale, NAME_BY_LOCALE, createSourceStringId, createTranslationStringId } from '@repo/subs';
import { useWalletContext } from './WalletContext';
import {
    Attestor,
    encodeTranslationAttestationSchema,
    TRANSLATION_ATTESTATION_SCHEMA, SCHEMA_REGISTRY_CONTRACT_ADDRESS, EAS_CONTRACT_ADDRESS,
    TRANSLATION_SCHEMA_UID,
    Attestation,
    SignedOffchainAttestation
} from '@repo/attestation'
import { useTranslationContext } from './TranslationContext';
import { createMemo, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

export const AttestButtonGroup = () => {
    const [store, setStore] = createStore({
        attestation: null

    })

    const sourceId = 'youtube-a';

    const { localeStore } = useTranslationContext()
    const { fromLocale, toLocale } = localeStore

    // const [attestation, setAttestation] = createSignal<Attestation>(null)

    const { signer } = useWalletContext();


    const { activeCue } = useTranslationContext();

    const attest = (cue: VTTCue, score: number) => {

        const attestor = new Attestor(
            signer,
            TRANSLATION_ATTESTATION_SCHEMA,
            SCHEMA_REGISTRY_CONTRACT_ADDRESS, EAS_CONTRACT_ADDRESS, '0x962EFc5A602f655060ed83BB657Afb6cc4b5883F',
            TRANSLATION_SCHEMA_UID
        );
        const data = {
            sourceId,
            sourceStringId: createSourceStringId(sourceId, Locale.En, cue.id),
            translatedStringId: createTranslationStringId(sourceId, Locale.En, Locale.Zh, cue.id),
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

    const uid = createMemo(() => {
        return (store.attestation?.sig?.uid || '')
    })

    return (
        <div class="text-xl" >
            <div class="flex flex-col">
                <div class="flex flex-row p-2">
                    Translation Id:
                    <div class="badge badge-primary text-lg px-4">

                        {createTranslationStringId(sourceId, fromLocale, toLocale, activeCue().id)}
                    </div>
                </div>
                <div class="flex flex-row w-full">
                    <div class="relative mr-5"><button onClick={() => attest(activeCue, 1)}
                        class="btn btn-outline text-white">🔼 Vote Up</button></div>
                    <div class="relative ml-5"><button onClick={() => attest(activeCue, -1)}
                        class="btn btn-outline text-white">🔽 Vote Down</button></div>
                </div>
                <div class="flex flex-row">
                    <div >
                        {
                            store.attestation && (
                                <div class="relative w-full">
                                    ☑️ Attested
                                    <br />
                                    {/* <a target="_blank" href={"https://sepolia.easscan.org/attestation/view/" + uid()}> */}
                                    {uid()}
                                    {/* </a> */}

                                </div>
                            )
                        }
                    </div>
                </div>



            </div>
        </div >
    )
}