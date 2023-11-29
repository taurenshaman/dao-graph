import { Wallet } from "../accounts/Wallet";

export class ViewData {
    static wallet: Wallet | null;
    static ethAddress: string = "";
    static connected: boolean = false;

    static did: string = "";
    // static didENS: string = "";
    // static didDotBit: string = "";

}