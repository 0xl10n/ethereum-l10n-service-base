import { useContext, createContext } from 'react';
import { usePrivy, getAccessToken } from '@privy-io/react-auth';


const PortalContext = createContext();


export const PortalContextProvider = (props) => {

    console.log('portal context init')
    // chrome.tabs.sendMessage(tab.id, { action, actionParams }, function (response) {
    //     console.log('res', response)
    // });


    return <PortalContext.Provider
        value={{

        }}
    >
        {props.children}
    </PortalContext.Provider>

}


export const usePortalContext = (): any => useContext(PortalContext);

