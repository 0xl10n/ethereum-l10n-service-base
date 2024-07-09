import { createContext, createEffect, createMemo, createSignal, useContext } from 'solid-js';
import { createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'
// import * as LitJsSdk from "@lit-protocol/lit-node-client";
// import { checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";
import { Wallet, ethers } from 'ethers';

import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import { BrowserProvider } from 'ethers';

const WalletContext = createContext();


const coinbaseSdk = new CoinbaseWalletSDK({
    appName: 'Ethereum Localization Service',
    appChainIds: [
        84532
    ]
});


export const WalletContextProvider = (props) => {
    const [chainId, setChainId] = createSignal(84532)
    const [signer, setSigner] = createSignal(null)
    const [address, setAddress] = createSignal(null);





    // chain at coinbase overriding
    // https://github.com/coinbase/coinbase-wallet-sdk/issues/486


    const cbProvider = coinbaseSdk.makeWeb3Provider({ options: 'smartWalletOnly' });


    const provider = new ethers.BrowserProvider(cbProvider);


    createEffect(async () => {

        console.log('setup')
        const loadSigner = await provider.getSigner();
        setSigner(loadSigner);
        // // Use provider
        const addresses = await cbProvider.request({ method: 'eth_requestAccounts' });

        console.log('coinbase addresses', addresses)

        setAddress(addresses?.[0])

        // TODO show error on wrong network 
        // which happens if coinbase got cached

    })


    return <WalletContext.Provider
        value={{
            signer: signer,
            chainId,
            address

            // client
        }}
    >{props.children}</WalletContext.Provider>

}


export const useWalletContext = (): any => useContext(WalletContext);

