import { createContext, useContext } from 'solid-js';

import { createStore, produce } from 'solid-js/store';
import { parseForCues, VTT_WHISPER_ZH_TW, VTT_WHISPER_EN, Locale } from '@repo/subs';
import { tap } from 'rxjs';
import { usePlaybackReceivedContext } from './PlaybackReceivedContext';

export type SubsContextArgs = {
    cuesByLocale: {}
}

const SubsContext = createContext<SubsContextArgs>({ cuesByLocale: {} });

export const SubsContextProvider = (props) => {
    const [cuesByLocale, setCuesByLocale] = createStore({
        [Locale.En]: [],
        [Locale.ZhTw]: []
    });

    // TODO run once only
    parseForCues(window, VTT_WHISPER_EN)
        .pipe(
            tap((cue) => {
                setCuesByLocale(
                    produce((cueByLocale) => {
                        cueByLocale[Locale.En].push(cue);
                    }),
                );
            }),
        )
        .subscribe();

    parseForCues(window, VTT_WHISPER_ZH_TW)
        .pipe(
            tap((cue) => {
                setCuesByLocale(
                    produce((cueByLocale) => {
                        cueByLocale[Locale.ZhTw].push(cue);
                    }),
                );
            }),
        )
        .subscribe();

    return (
        <SubsContext.Provider
            value={{
                cuesByLocale,
            }}
        >
            {props.children}
        </SubsContext.Provider>
    );
};


export const useSubsContext = () => useContext(SubsContext); 