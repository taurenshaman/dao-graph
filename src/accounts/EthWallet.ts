import { ethers } from "ethers";
import { Wallet } from "./Wallet";

export class EthWallet extends Wallet {
    signer: ethers.JsonRpcSigner | null = null;
    constructor() {
        super();
    }

    getProvider(): any {
        let provider;
        if ((window as any).ethereum == null) {
            // If MetaMask is not installed, we use the default provider,
            // which is backed by a variety of third-party services (such
            // as INFURA). They do not have private keys installed so are
            // only have read-only access
            console.log("MetaMask not installed; using read-only defaults");
            // provider = ethers.getDefaultProvider({
            //     chainId: 1,
            //     name: "Ethereum"
            // });
            provider = ethers.getDefaultProvider("mainnet");
        } else {
            // Connect to the MetaMask EIP-1193 object. This is a standard
            // protocol that allows Ethers access to make all read-only
            // requests through MetaMask.
            provider = new ethers.BrowserProvider((window as any).ethereum);
        }
        return provider;
    }

    async connect(): Promise<string> {
        // this.account = "";
        // const ethereum = (window as any).ethereum;
        // if (!ethereum) {
        //     ViewData.toast({
        //         title: 'No Ethereum wallet detected!',
        //         description: "Your should install a Ethereum wallet first.",
        //         status: 'error',
        //         duration: 3000,
        //         isClosable: true,
        //     });
        //     return "";
        // }

        // const ethNetwork = await EthWallet.requestETHNetwork(ethereum);
        // const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        // this.account = accounts[0];

        const provider = this.getProvider();
        this.signer = await provider.getSigner();
        this.account = await this.signer?.getAddress() || "";

        return this.account;
    }

    async signMessage(message: string): Promise<string> {
        const signature = await this.signer?.signMessage(message) || "";
        return signature;
    }

    async verifyMessage(message: string, signature: string): Promise<boolean> {
        const r = ethers.verifyMessage(message, signature);
        return r.toLocaleLowerCase() === this.account.toLocaleLowerCase();
    }

    async switchNetwork(networkName: string, networkInfo: any): Promise<any> {
        const result = await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: networkInfo.chainId
            }]
        });
        return result;
    }
}