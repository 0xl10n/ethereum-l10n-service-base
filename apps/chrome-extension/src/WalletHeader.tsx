
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

const ProfileButton = () => {

    const avatar = (
        <div class="avatar">
            <div class="w-12 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
        </div>
    )
    return (

        <a href="https://0xl10n.org/portal/login" target='_blank' class="btn btn-ghost">
            <button>Connect</button>
        </a>

    )

}

export const WalletHeader = () => {

    const { signer, chainId } = useWalletContext();
    const { name: chainName, imageUrl } = CHAIN_INFO_BY_ID[chainId()]
    return (
        <div class="text-lg pb-2">
            <div class="flex flex-row justify-end">
                <div class="flex flex-row pr-4">
                    <img src={imageUrl || "https://chainlist.org/unknown-logo.png"}
                        class="rounded-full flex-shrink-0 flex relative w-6 h-6 m-2" alt="Sepolia logo"></img>
                </div>
                <div class="divider"></div>
                {/* <div>
                    {chainName}
                </div> */}
                {/* <div>
                    {signer.address}
                </div> */}
                <div class="right-0 flex justify-end">
                    <ProfileButton />
                </div>
            </div>
        </div>
    )
}