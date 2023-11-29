
export interface IWallet {
    connect(): Promise<string>;
    signMessage(message: string): Promise<string>;
    supportNetwork(chainId: string): Promise<boolean>;
    switchNetwork(networkName: string, networkInfo: any): Promise<boolean>;
}

export class Wallet implements IWallet {
    account: string = "";
    
    async connect(): Promise<string>{
        return "";
    }

    async signMessage(message: string): Promise<string>{
        return "";
    }

    async supportNetwork(chainId: string): Promise<boolean> {
        return false;
    }

    async switchNetwork(networkName: string, networkInfo: any): Promise<boolean> {
        return false;
    }

}