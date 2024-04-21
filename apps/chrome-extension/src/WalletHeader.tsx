
import { useWalletContext } from './WalletContext';

const CHAIN_INFO_BY_ID = {
    11155111: {
        name: 'Sepolia',
        imageUrl: 'https://chainlist.org/unknown-logo.png'
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
        <div class="text-xl">
            <div class="flex flex-row">
                <div class="flex flex-row pr-4">
                    <img src={imageUrl || "https://chainlist.org/unknown-logo.png"}
                        width="26" height="26" class="rounded-full flex-shrink-0 flex relative" alt="Sepolia logo"></img>
                    {name}
                </div>
                <div>
                    {signer.address}
                </div>
            </div>
        </div>
    )
}