//import { authWithPopup, signMessageWithPopup, AuthResponseData } from '@joyid/core'
//import { JoyIDProvider } from '@joyid/ethers';
import { connect, initConfig, sendTransaction, signMessage  } from "@joyid/evm";
import { AppSettings } from "../client/AppSettings";
import { Wallet } from './Wallet';
import { parseEther } from "ethers";

export class JoyIDEvmWallet extends Wallet {
    constructor() {
        super();
        initConfig({
            // name of your app
            name: AppSettings.appName,
            // logo of your app
            logo: AppSettings.appIcon,
            // JoyID app url that your app is integrated with
            joyidAppURL: "https://app.joy.id",
        });
    }

    async connect(): Promise<string> {
        this.account = await connect();
        console.log(`EVM address: ${this.account}`);
        return this.account;
    }

    async signMessage(message: string): Promise<string> {
        let signature = await signMessage(message, this.account);
        return signature;
    }

    static switchNetwork(networkName: string, networkInfo: any) {
        initConfig({
            // name of your app
            name: AppSettings.appName,
            // logo of your app
            logo: AppSettings.appIcon,
            // JoyID app url that your app is integrated with
            joyidAppURL: "https://app.joy.id",
            // evm
            rpcURL: networkInfo.requestParams.rpcUrl,
            network: {
                name: networkName,
                chainId: networkInfo.chainId,
            }
        });
    }

    static async submitTx(eth: string, data: string, signer: string, to: string) {
        const value = parseEther(eth);
        const txhash = await sendTransaction({
                to,
                value: value.toString(),
                data
            },
            signer,
        );
        return txhash;
    }

    // static createProvider(networkName: string, networkInfo: any): JoyIDProvider {
    //     const rpcURL = 'https://ethereum-sepolia.blockpi.network/v1/rpc/public'
    //     const network = {
    //         name: networkName,
    //         chainId: networkInfo.chainId,
    //     };
    //     const joyidConfig = {
    //         rpcURL: networkInfo.requestParams.rpcUrl,
    //         network,
    //         // name of your app
    //         name: AppSettings.appName,
    //         // logo of your app
    //         logo: AppSettings.appIcon,
    //         // JoyID app url that your app is integrated with
    //         joyidAppURL: "https://app.joy.id",
    //     };
    //     return new JoyIDProvider(
    //         rpcURL,
    //         network,
    //         joyidConfig
    //     );
    // }
}
//public key of CKB: length=128, 64 bytes
//1d1fae26d1429b91c41791f969259f6f6d9d66b3e2c6305980e9b532d03aa183f4f82db3e36d861e83b44bbd83e0eb1aa05def093fb76e0e8098af51b900181b
//42069420694206942069420694206942069420694206942069420694206942069420694206942069420694206942069420694206942069420694206942069420
