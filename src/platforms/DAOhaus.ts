import { Dao_Filter, Dao_OrderBy, ListDaosQueryResDaos, listDaos } from '@daohaus/moloch-v3-data';
import { IListQueryResults } from "@daohaus/data-fetch-utils";
import { PlatformBase } from "./PlatformBase";
import { ChainsInfo } from '../client/ChainsInfo';
import { DAOInfo } from '../models/DAOInfo';

export type DAOhausNetworkType = "0x1" | "0x64" | "0xa" | "0x89" | "0xa4b1" | "0x2105" | "0xaa36a7";
export type DAOhausPagingType = {
    pageSize: number;
    offset?: number;
    lastId?: string;
    previousPageLastId?: string;
} | undefined;

const createPaging0 = (count_per_page: number = 20): DAOhausPagingType => {
    return { pageSize: count_per_page, offset: 0, lastId: undefined, previousPageLastId: undefined };
}

export class DAOhaus extends PlatformBase {
    nextPaging: DAOhausPagingType = undefined as DAOhausPagingType;
    previousPaging: DAOhausPagingType = undefined as DAOhausPagingType;

    constructor(supported_chains: Array<string>){
        super();
        this.id = "daohaus";
        this.linkOfCreateDAO = "https://summon.daohaus.club/";
        this.supportedChains = supported_chains;
    }

    override getDefaultChainId() { return ChainsInfo.ethereum.mainnet.requestParams.chainId; }

    override getLinkOfDAO(dao: DAOInfo) { return `https://admin.daohaus.club/#/molochv3/${this.chainId}/${dao.id}`; }

    override parse(originalItems: any) {
        this.items = [];
        if(!originalItems || !Array.isArray(originalItems) || originalItems.length === 0) return;
        originalItems.forEach((originalItem) => {
            this.items.push({
                id: originalItem.id,
                daoType: "N/A",
                name: originalItem.name,
                avatar: originalItem.avatarImg || `https://robohash.org/${originalItem.id}.png?set=set3`,
                description: originalItem.description || "[Not Set]",
                activeMemberCount: originalItem.activeMemberCount || 0,
                proposalCount: originalItem.proposalCount || 0
            });
        });
    }

    override clearPaging() {
        this.nextPaging = undefined;
        this.previousPaging = undefined;
    }

    async doLoadDaos(query: string, paging: DAOhausPagingType) {
        let res: IListQueryResults<Dao_OrderBy, Dao_Filter, ListDaosQueryResDaos>;
        // filter:
        // /mnt/e/github/dao-graph/node_modules/@daohaus/moloch-v3-data/src/subgraph/schema.generated.d.ts
        try {
            res = await listDaos({
                networkId: this.chainId as DAOhausNetworkType,
                ordering: { orderBy: "createdAt", orderDirection: "desc" },
                filter: query.length > 0 ? { name_contains_nocase: query } : undefined,
                paging: paging,
                graphApiKeys: {
                    "0x1": "23b6fc3e2f8313a2ee6c04b4d443d3da",//eth
                    "0xa4b1": "23b6fc3e2f8313a2ee6c04b4d443d3da",//arb
                    "0x2105": "23b6fc3e2f8313a2ee6c04b4d443d3da",//base
                    "0x64": "23b6fc3e2f8313a2ee6c04b4d443d3da",//gnosis
                    "0x89": "23b6fc3e2f8313a2ee6c04b4d443d3da",//polygon
                    "0xa": "23b6fc3e2f8313a2ee6c04b4d443d3da"//OP
                },
            });
            console.log(res);
            this.nextPaging = res.nextPaging;
            this.previousPaging = res.previousPaging;
            this.parse(res.items);
        }
        finally {
        }
    }

    override async loadDaos(query: string) {
        const paging = createPaging0(this.CountPerPage);
        await this.doLoadDaos(query, paging);
    }

    override async loadDaosNext(query: string) {
        await this.doLoadDaos(query, this.nextPaging);
    }

    override async loadDaosPrevious(query: string) {
        await this.doLoadDaos(query, this.previousPaging);
    }

    override canLoadNextPage(): boolean {
        return this.chainId.length > 0 && this.nextPaging !== undefined && this.nextPaging !== null;
    }
    override canLoadPreviousPage(): boolean {
        return this.chainId.length > 0 && this.previousPaging !== undefined && this.previousPaging !== null;
    }
}

export class DAOhausUtils {
    static getSupportedNetwork(networkId: string) {
        let n = networkId as DAOhausNetworkType || "0x1";
        return n;
    }
}