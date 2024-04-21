import { Locale, NAME_BY_LOCALE, createSourceStringId, createTranslationStringId } from '@repo/subs';
import { useWalletContext } from './WalletContext';
import {
    Attestor,
    encodeTranslationAttestationSchema,
    TRANSLATION_ATTESTATION_SCHEMA, SCHEMA_REGISTRY_CONTRACT_ADDRESS, EAS_CONTRACT_ADDRESS,
    TRANSLATION_SCHEMA_UID
} from '@repo/attestation'
import { useTranslationContext } from './TranslationContext';

export const AttestButtonGroup = () => {

    const { signer } = useWalletContext();


    const { activeCue } = useTranslationContext();

    const attest = (cue) => {
        const attestor = new Attestor(
            signer,
            TRANSLATION_ATTESTATION_SCHEMA,
            SCHEMA_REGISTRY_CONTRACT_ADDRESS, EAS_CONTRACT_ADDRESS, '0x962EFc5A602f655060ed83BB657Afb6cc4b5883F',
            TRANSLATION_SCHEMA_UID
        );
        const sourceId = 'youtube-a';
        const data = {
            sourceId,
            sourceStringId: createSourceStringId(sourceId, Locale.En, cue.id),
            translatedStringId: createTranslationStringId(sourceId, Locale.En, Locale.Zh, cue.id),
            score: 90,
            version: 1
        };

        const encodedData = encodeTranslationAttestationSchema(
            data
        )

        attestor.attestOffChain(encodedData)
            .then(async (attestation) => {
                console.log('attestation', attestation)
            })


    }

    return (
        <div class="text-xl">
            <div class="flex">
                {activeCue.id}
                {activeCue.text}
                <button onClick={() => attest(activeCue)}>Attest Translation</button>
            </div>
        </div>
    )
}