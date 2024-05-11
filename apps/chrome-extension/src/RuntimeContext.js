"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRuntimeContext = exports.RuntimeContextProvider = void 0;
const solid_js_1 = require("solid-js");
const chrome_util_1 = require("./chrome-util");
const RuntimeContext = (0, solid_js_1.createContext)();
const RuntimeContextProvider = (props) => {
    const [playbackTimeSReceived, setPlaybackTimeSReceived] = (0, solid_js_1.createSignal)(0);
    const sendPlaybackControl = (action, actionParams) => {
        (0, chrome_util_1.getCurrentTab)()
            .then(tab => {
            console.log(tab?.id);
            chrome.tabs.sendMessage(tab.id, { action, actionParams }, function (response) {
                console.log('res', response);
            });
        });
    };
    if (chrome.runtime) {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            console.log("Message from the content script:", request);
            setPlaybackTimeSReceived(request.playbackTimeS);
            sendResponse({ message: "Roger" });
        });
    }
    return <RuntimeContext.Provider value={{
            sendPlaybackControl,
            playbackTimeSReceived
        }}>{props.children}</RuntimeContext.Provider>;
};
exports.RuntimeContextProvider = RuntimeContextProvider;
const useRuntimeContext = () => (0, solid_js_1.useContext)(RuntimeContext);
exports.useRuntimeContext = useRuntimeContext;
