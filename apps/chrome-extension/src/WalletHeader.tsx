
import { useWalletContext } from './WalletContext';

const CHAIN_INFO_BY_ID = {
    11155111: {
        name: 'Sepolia',
        imageUrl: 'https://chainlist.org/unknown-logo.png'
    },
    421613: {
        name: 'Arbitrum Goerli',
        imageUrl: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg'
    },
    421614: {
        name: 'Arbitrum Sepolia',
        imageUrl: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg'
    },
    10200: {
        name: 'Gnosis Chiado',
        imageUrl: 'https://icons.llamao.fi/icons/chains/rsz_xdai.jpg'
    }
}

export const WalletHeader = () => {

    const { signer, chainId } = useWalletContext();
    const { name, imageUrl } = CHAIN_INFO_BY_ID[chainId()]
    return (
        <div class="text-lg pb-2">
            <div class="flex flex-row">
                <div class="flex flex-row pr-4">
                    <img src={imageUrl || "https://chainlist.org/unknown-logo.png"}
                        class="rounded-full flex-shrink-0 flex relative w-6 h-6 m-2" alt="Sepolia logo"></img>
                    {name}
                </div>
                <div class="divider"></div>
                <div>
                    {signer.address}
                </div>
            </div>
        </div>
    )
}