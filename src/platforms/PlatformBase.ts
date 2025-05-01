import { DAOInfo } from "../models/DAOInfo";

export class PlatformBase {
    readonly CountPerPage: number = 20;
    id: string = "";
    chainId: string = "";
    linkOfCreateDAO: string = "";
    items: Array<DAOInfo> = [];
    supportedChains: Array<string> = [];

    getDefaultChainId() { return ""; }
    switChain(newChainId: string) {
        if(this.supportedChains.indexOf(newChainId) < 0){
            throw new Error(`Unsupported chain: ${newChainId}`);
            return;
        }
        this.chainId = newChainId;
    }
    getLinkOfDAO(dao: DAOInfo) { return dao.id; }
    parse(originalItems: any) {}
    clearPaging() {}
    async loadDaos(query: string) {}
    async loadDaosNext(query: string) {}
    async loadDaosPrevious(query: string) {}
    canLoadNextPage(): boolean { return false; }
    canLoadPreviousPage(): boolean { return false; }
}