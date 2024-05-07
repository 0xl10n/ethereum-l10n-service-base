import { createContext, createSignal, useContext } from "solid-js";
import { getCurrentTab } from "./chrome-util";

const RuntimeContext = createContext();


export const RuntimeContextProvider = (props) => {

    const [playbackTimeSReceived, setPlaybackTimeSReceived] = createSignal(0)
    const sendPlaybackControl = (action: string, actionParams: any) => {
        getCurrentTab()
            .then(tab => {
                console.log(tab?.id);
                chrome.tabs.sendMessage(tab.id, { action, actionParams }, function (response) {
                    console.log('res', response)
                });

            })

    }
    if (chrome.runtime) {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {

                if (request?.source === 'portal') {
                    console.log("Message from the portal script:", request);
                } else {
                    console.log("Message from the content script:", request);
                    setPlaybackTimeSReceived(request.playbackTimeS);
                    sendResponse({ message: "Roger" });
                }
            }
        );

    }




    return <RuntimeContext.Provider
        value={{
            sendPlaybackControl,
            playbackTimeSReceived
        }}
    >{props.children}</RuntimeContext.Provider>

}


export const useRuntimeContext = (): any => useContext(RuntimeContext);

