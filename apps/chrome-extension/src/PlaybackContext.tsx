import { Accessor, Signal, createContext, createSignal, useContext } from 'solid-js';

import { createStore, produce } from 'solid-js/store';

import { tap } from 'rxjs';


const PlaybackContext = createContext();

/**
 * 2 cases: 
 * - content script
 * - youtube time
 */

const getYoutubeTimeWithDocument = (document) => {
    const video = document.querySelector('video');
    return video?.currentTime;
}
const getYoutubeTime = () => {

    return getYoutubeTimeWithDocument(document);
}

export const PlaybackContextProvider = (props) => {
    const [currentPlaybackS, setcurrentPlaybackS] = createSignal(0);

    setInterval(() => {
        // TODO sync with video

        const playbackTimeS = getYoutubeTime()
        setcurrentPlaybackS(
            playbackTimeS
        );

        chrome.runtime.sendMessage({ playbackTimeS }, function (response) {
            console.log('response', response);
        });

    }, 1000);

    const playback = [currentPlaybackS];

    return (
        <PlaybackContext.Provider
            value={playback}
        >{props.children}
        </PlaybackContext.Provider>
    )

}


export const usePlaybackContext = (): any => useContext(PlaybackContext);