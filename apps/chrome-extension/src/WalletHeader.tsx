
import { useWalletContext } from './WalletContext';

export const WalletHeader = () => {

    const { signer } = useWalletContext();


    return (
        <div class="text-xl">
            <div class="flex">
                {signer.address}
            </div>
        </div>
    )
}