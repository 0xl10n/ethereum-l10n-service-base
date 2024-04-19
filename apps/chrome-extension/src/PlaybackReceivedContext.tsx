import { Accessor, Signal, createContext, createSignal, useContext } from 'solid-js';

import { createStore, produce } from 'solid-js/store';

import { tap } from 'rxjs';
import { useRuntimeContext } from './RuntimeContext';


const PlaybackReceivedContext = createContext();


// Mirror PlaybackContext as much as possible
export const PlaybackReceivedContextProvider = (props) => {

    const { sendPlaybackControl, playbackTimeSReceived } = useRuntimeContext();


    console.log('playbackTimeSReceived', playbackTimeSReceived)
    return (
        <PlaybackReceivedContext.Provider
            value={[playbackTimeSReceived, sendPlaybackControl]}
        >
            {props.children}
        </PlaybackReceivedContext.Provider >
    )

}


export const usePlaybackReceivedContext = (): any => useContext(PlaybackReceivedContext);