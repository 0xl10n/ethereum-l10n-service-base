import { createContext, createEffect, createMemo, createSignal, useContext } from 'solid-js';
import { createWalletClient, custom, http } from 'viem'
import { mainnet } from 'viem/chains'
// import * as LitJsSdk from "@lit-protocol/lit-node-client";
// import { checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";
import { privateKeyToAccount } from 'viem/accounts';
import { Wallet, ethers } from 'ethers';

const WalletContext = createContext();

const demoWalletPrivateKey = '0x3db76cdd104b07bebf2221076fab7485c03b59f5af25322497763a52b05bd94c';
/**
 * 
 * we intentionally use a separate wallet and not the one connecting with metamask
 * For demo purpose, now a hardcoded wallet is used
 * in future we will delegate to lit action to sign for EAS Lit.Actions.signEcdsa
 */

const loadSession = () => {
    // chrome.storage.sync.get({ 'foo': 'hello', 'bar': 'hi' }, function () {
    //     console.log('Settings saved');
    // });
}




export const WalletContextProvider = (props) => {
    const [chainId, setChainId] = createSignal(11155111)

    // 42161 arbitrum
    // 421614 arbitrum sepolia
    // 10200 gnosis chiado Testnet

    const provider = ethers.getDefaultProvider(11155111)
    const signer = new Wallet(demoWalletPrivateKey, provider)
    const account = privateKeyToAccount(demoWalletPrivateKey);

    const client = createWalletClient({
        chain: mainnet,
        transport: http(),
        account
    })


    createEffect(async () => {
        const { chainId } = await provider.getNetwork()
        setChainId(Number(chainId))
    })


    // get auth update from RuntimeContext


    // storage for auth
    // Save it using the Chrome extension storage API.
    // chrome.storage.sync.set({ 'foo': 'hello', 'bar': 'hi' }, function () {
    //     console.log('Settings saved');
    // });




    createEffect(async () => {
        // const litNodeClient = new LitJsSdk.LitNodeClient({
        //     litNetwork: 'manzano',
        // });

        // console.log('connect')
        // await litNodeClient.connect();

        // let nonce = await litNodeClient.getLatestBlockhash();

        // const authSig = await checkAndSignAuthMessage({
        //     chain: "ethereum",
        //     nonce
        // });

        // const contractClient = new LitContracts({
        //     signer: wallet,
        //     network: 'habanero',
        // });

        // await contractClient.connect();
    })


    // const [address] = await client.getAddresses()

    return <WalletContext.Provider
        value={{
            signer,
            chainId
            // client
        }}
    >{props.children}</WalletContext.Provider>

}


export const useWalletContext = (): any => useContext(WalletContext);

