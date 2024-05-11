"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePlaybackReceivedContext = exports.PlaybackReceivedContextProvider = void 0;
const solid_js_1 = require("solid-js");
const RuntimeContext_1 = require("./RuntimeContext");
const PlaybackReceivedContext = (0, solid_js_1.createContext)();
// Mirror PlaybackContext as much as possible
const PlaybackReceivedContextProvider = (props) => {
    const { sendPlaybackControl, playbackTimeSReceived } = (0, RuntimeContext_1.useRuntimeContext)();
    console.log('PlaybackReceivedContextProvider', playbackTimeSReceived);
    return (<PlaybackReceivedContext.Provider value={[playbackTimeSReceived, sendPlaybackControl]}>
            {props.children}
        </PlaybackReceivedContext.Provider>);
};
exports.PlaybackReceivedContextProvider = PlaybackReceivedContextProvider;
const usePlaybackReceivedContext = () => (0, solid_js_1.useContext)(PlaybackReceivedContext);
exports.usePlaybackReceivedContext = usePlaybackReceivedContext;
