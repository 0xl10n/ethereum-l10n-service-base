import _ from 'lodash'
import { createContext, createMemo, JSXElement, useContext } from "solid-js";
import { usePlaybackReceivedContext } from './PlaybackReceivedContext';

import { isCurrentCue, Locale } from '@repo/subs';
import { useSubsContext } from './SubsContext';

const TranslationContext = createContext();

// Mirror PlaybackContext as much as possible
export const TranslationContextProvider = (props) => {

    const [playbackTimeSReceived, sendPlaybackControl] = usePlaybackReceivedContext();


    const subsContext = useSubsContext();

    const { cuesByLocale } = subsContext;

    const cuesFrom = cuesByLocale[Locale.En] || [];

    // TODO more efficient to seek from cues instead of one observer each
    const activeCue = createMemo(() => {
        return _.find(
            cuesFrom,
            cue => isCurrentCue(cue, playbackTimeSReceived())
        );
    })


    return (
        <TranslationContext.Provider
            value={{
                activeCue
            }}
        >
            {props.children}
        </TranslationContext.Provider >
    )

}


export const useTranslationContext = (): any => useContext(TranslationContext);