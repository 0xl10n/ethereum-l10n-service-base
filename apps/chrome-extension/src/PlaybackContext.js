"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePlaybackContext = exports.PlaybackContextProvider = void 0;
const solid_js_1 = require("solid-js");
const PlaybackContext = (0, solid_js_1.createContext)();
/**
 * 2 cases:
 * - content script
 * - youtube time
 */
const getYoutubeTimeWithDocument = (document) => {
    const video = document.querySelector('video');
    return video?.currentTime;
};
const getYoutubeTime = () => {
    return getYoutubeTimeWithDocument(document);
};
const PlaybackContextProvider = (props) => {
    const [currentPlaybackS, setcurrentPlaybackS] = (0, solid_js_1.createSignal)(0);
    setInterval(() => {
        // TODO sync with video
        const playbackTimeS = getYoutubeTime();
        setcurrentPlaybackS(playbackTimeS);
        chrome.runtime.sendMessage({ playbackTimeS }, function (response) {
            console.log('response', response);
        });
    }, 1000);
    const playback = [currentPlaybackS];
    return (<PlaybackContext.Provider value={playback}>{props.children}
        </PlaybackContext.Provider>);
};
exports.PlaybackContextProvider = PlaybackContextProvider;
const usePlaybackContext = () => (0, solid_js_1.useContext)(PlaybackContext);
exports.usePlaybackContext = usePlaybackContext;
