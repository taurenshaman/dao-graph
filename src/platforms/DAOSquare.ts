import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { AppSettings } from "../client/AppSettings";
import { PlatformBase } from "./PlatformBase";
import { ChainsInfo } from '../client/ChainsInfo';
import { DAOInfo } from '../models/DAOInfo';

export class DAOSquare extends PlatformBase {
    // nextPaging: DAOhausPagingType = undefined as DAOhausPagingType;
    // previousPaging: DAOhausPagingType = undefined as DAOhausPagingType;
    pageIndex: number = 0;
    countPerPage: number = 20;
    itemsCount: number = 0;
    graphql_endpoint = `https://gateway.thegraph.com/api/${AppSettings.apiKey_theGraph}/subgraphs/id/FoTCW8c8aarckvxt4ukDK55CEn29qeUFh7Xi5pvFd3ph`;
    client = new ApolloClient({
      uri: this.graphql_endpoint,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/graphql-response+json, application/json, multipart/mixed',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': "true",
      },
      cache: new InMemoryCache()
    });

    constructor(supported_chains: Array<string>){
        super();
        this.id = "daosquare";
        this.linkOfCreateDAO = "https://app.daosquare.fi/venturedaos/summon";
        this.supportedChains = supported_chains;
    }

    override getDefaultChainId() { return ChainsInfo.base.mainnet.requestParams.chainId; }

    // TODO
    override getLinkOfDAO(dao: DAOInfo) { return `https://app.daosquare.fi/venturedaos/${dao.daoType}/${dao.id}`; }

    override parse(originalItems: any) {
        this.items = [];
        this.itemsCount = 0;
        if(!originalItems || !Array.isArray(originalItems) || originalItems.length === 0) return;
        originalItems.forEach((originalItem) => {
            this.items.push({
                id: originalItem.id,
                daoType: originalItem.daoType,
                name: originalItem.daoName,
                avatar: originalItem.avatarImg || `https://robohash.org/${originalItem.id}.png?set=set3`,
                description: `Type: ${originalItem.daoType}`,
                activeMemberCount: 0,
                proposalCount: 0
            });
        });
        this.itemsCount = this.items.length;
    }

    override clearPaging() {
        this.pageIndex = 0;
    }

    async doLoadDaos(query: string) {
        const first = this.CountPerPage;
        const skip = this.CountPerPage * this.pageIndex;
        try {
            const ql = query && query.length > 0 ? `
                query listDaos($query: String, $first: Int, $skip: Int){
                    daoEntiys(first: $first, skip: $skip, orderBy: createTimeStamp, orderDirection: desc, where: {daoName_contains_nocase: $query }) {
                        id
                        daoAddr
                        daoName
                        creator
                        daoType
                    }
                }
            ` : `
                query listDaos($first: Int, $skip: Int) {
                    daoEntiys(first: $first, skip: $skip, orderBy: createTimeStamp, orderDirection: desc) {
                        id
                        daoAddr
                        daoName
                        creator
                        daoType
                    }
                }
            `;
            console.log(ql);
            const res = await this.client.query({
                query: gql(ql),
                variables: query && query.length > 0 ? {
                    query, first, skip
                } : {
                  first, skip
                }
            });
            console.log(res);
            // this.nextPaging = res.nextPaging;
            // this.previousPaging = res.previousPaging;
            this.parse(res.data.daoEntiys);
        }
        catch(error){
            console.log(error);
        }
        finally {
        }
    }

    override async loadDaos(query: string) {
        this.clearPaging();
        await this.doLoadDaos(query);
    }

    override async loadDaosNext(query: string) {
      this.pageIndex++;
      await this.doLoadDaos(query);
    }

    override async loadDaosPrevious(query: string) {
      this.clearPaging();
      await this.doLoadDaos(query);
    }

    override canLoadNextPage(): boolean {
        return this.chainId.length > 0 && this.itemsCount == this.CountPerPage;
    }
    override canLoadPreviousPage(): boolean {
        return this.chainId.length > 0 && this.pageIndex > 0;
    }
}

/*
{
  "data": {
    "daoEntiys": [
      {
        "id": "0x4669296b52a808c863686946351e127a0802f690",
        "daoAddr": "0x4669296b52a808c863686946351e127a0802f690",
        "daoName": "vd199",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Dec 19 2023 10:20:25",
        "createTimeStamp": "1702981225",
        "daoType": "vintage"
      },
      {
        "id": "0x0f7a1494d460bcea1d9177d4cbdfdbd51a406e4a",
        "daoAddr": "0x0f7a1494d460bcea1d9177d4cbdfdbd51a406e4a",
        "daoName": "Lolicorn_1210B_Flex",
        "creator": "0xd9f04ec9a0ac241edc631cb0b44f11d17cd13bbe",
        "createDateTime": "Tue Dec 19 2023 09:02:40",
        "createTimeStamp": "1702976560",
        "daoType": "flex"
      },
      {
        "id": "0xc2bbc6fdf262902bacf62bf5f819afa04af9a6de",
        "daoAddr": "0xc2bbc6fdf262902bacf62bf5f819afa04af9a6de",
        "daoName": "FlexT1219A",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Tue Dec 19 2023 08:17:05",
        "createTimeStamp": "1702973825",
        "daoType": "flex"
      },
      {
        "id": "0x5bf1c746ce35b535913db869e958c03d404ff3bf",
        "daoAddr": "0x5bf1c746ce35b535913db869e958c03d404ff3bf",
        "daoName": "Lolicorn_1219_Flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Tue Dec 19 2023 03:04:15",
        "createTimeStamp": "1702955055",
        "daoType": "flex"
      },
      {
        "id": "0x9356d725a8a294bfa3ceb5aa353f85934e1ed5fb",
        "daoAddr": "0x9356d725a8a294bfa3ceb5aa353f85934e1ed5fb",
        "daoName": "vd19-",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Dec 19 2023 01:15:15",
        "createTimeStamp": "1702948515",
        "daoType": "vintage"
      },
      {
        "id": "0x81b173e608a172976976d1884f594838e5f60370",
        "daoAddr": "0x81b173e608a172976976d1884f594838e5f60370",
        "daoName": "vd19",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Mon Dec 18 2023 22:04:50",
        "createTimeStamp": "1702937090",
        "daoType": "vintage"
      },
      {
        "id": "0xa367927cc68eb2f7bb1b81b5e52cc851eb4d6f5d",
        "daoAddr": "0xa367927cc68eb2f7bb1b81b5e52cc851eb4d6f5d",
        "daoName": "Lolicorn_1218B_Flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Mon Dec 18 2023 11:55:30",
        "createTimeStamp": "1702900530",
        "daoType": "flex"
      },
      {
        "id": "0x75175addc205817ab88651c2b89f00ae4d49214a",
        "daoAddr": "0x75175addc205817ab88651c2b89f00ae4d49214a",
        "daoName": "FlexT1218E",
        "creator": "0xaf7393ddcc9beea13951b26b1ab633f0f2fce9c1",
        "createDateTime": "Mon Dec 18 2023 11:36:25",
        "createTimeStamp": "1702899385",
        "daoType": "flex"
      },
      {
        "id": "0xa3654837b550286d0a41d573a522e085c1873f4d",
        "daoAddr": "0xa3654837b550286d0a41d573a522e085c1873f4d",
        "daoName": "fd18",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Mon Dec 18 2023 08:04:25",
        "createTimeStamp": "1702886665",
        "daoType": "flex"
      },
      {
        "id": "0x19768703acb4a8305cdca76ed7570850367f22e2",
        "daoAddr": "0x19768703acb4a8305cdca76ed7570850367f22e2",
        "daoName": "Lolicorn_1218_Flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Mon Dec 18 2023 03:06:55",
        "createTimeStamp": "1702868815",
        "daoType": "flex"
      },
      {
        "id": "0x136545372dea434593704556f0525073911f37d5",
        "daoAddr": "0x136545372dea434593704556f0525073911f37d5",
        "daoName": "FlexT1218D",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Mon Dec 18 2023 02:48:15",
        "createTimeStamp": "1702867695",
        "daoType": "flex"
      },
      {
        "id": "0xe381cf089f399fe2b1209d29541de17853ad649d",
        "daoAddr": "0xe381cf089f399fe2b1209d29541de17853ad649d",
        "daoName": "FlexT1218C",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Mon Dec 18 2023 02:40:45",
        "createTimeStamp": "1702867245",
        "daoType": null
      },
      {
        "id": "0xc8bbdbb557e0ea60519cc56acb8d9da9788d35b1",
        "daoAddr": "0xc8bbdbb557e0ea60519cc56acb8d9da9788d35b1",
        "daoName": "FlexT1218B",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Mon Dec 18 2023 02:23:10",
        "createTimeStamp": "1702866190",
        "daoType": "flex"
      },
      {
        "id": "0xf274862275c3b7ec4af5a33a92f73f619cc37f5a",
        "daoAddr": "0xf274862275c3b7ec4af5a33a92f73f619cc37f5a",
        "daoName": "FlexT1218A",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Mon Dec 18 2023 02:19:35",
        "createTimeStamp": "1702865975",
        "daoType": "flex"
      },
      {
        "id": "0xed9705c673689b87dcb20d0f7437223d40aae122",
        "daoAddr": "0xed9705c673689b87dcb20d0f7437223d40aae122",
        "daoName": "Lolicorn_1215c_flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Fri Dec 15 2023 09:29:15",
        "createTimeStamp": "1702632555",
        "daoType": "flex"
      },
      {
        "id": "0x3e607989a18ce349fbc89d4f99d93b1043f3b0cd",
        "daoAddr": "0x3e607989a18ce349fbc89d4f99d93b1043f3b0cd",
        "daoName": "FlexT1215B",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Fri Dec 15 2023 08:25:10",
        "createTimeStamp": "1702628710",
        "daoType": "flex"
      },
      {
        "id": "0xbd7832e5ec27408954d3b59f892cbc63742cd332",
        "daoAddr": "0xbd7832e5ec27408954d3b59f892cbc63742cd332",
        "daoName": "Lolicorn_1215b_Flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Fri Dec 15 2023 04:23:35",
        "createTimeStamp": "1702614215",
        "daoType": "flex"
      },
      {
        "id": "0x6620cffc063d3bcf62af54ff1c49fe21fefd0597",
        "daoAddr": "0x6620cffc063d3bcf62af54ff1c49fe21fefd0597",
        "daoName": "Lolicorn_1215_Flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Fri Dec 15 2023 02:58:50",
        "createTimeStamp": "1702609130",
        "daoType": "flex"
      },
      {
        "id": "0x550da0ecd373ec51c614c92f7ceed875e902a5c8",
        "daoAddr": "0x550da0ecd373ec51c614c92f7ceed875e902a5c8",
        "daoName": "fd15-",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Fri Dec 15 2023 02:47:45",
        "createTimeStamp": "1702608465",
        "daoType": "vintage"
      },
      {
        "id": "0x3130274dfbd6a812b996f056677278ad2ec5b29c",
        "daoAddr": "0x3130274dfbd6a812b996f056677278ad2ec5b29c",
        "daoName": "vd15",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Fri Dec 15 2023 02:19:05",
        "createTimeStamp": "1702606745",
        "daoType": "vintage"
      },
      {
        "id": "0x2021312406d89e599b51ed09521131e0f8fe9e88",
        "daoAddr": "0x2021312406d89e599b51ed09521131e0f8fe9e88",
        "daoName": "FlexT1215A",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Fri Dec 15 2023 01:29:15",
        "createTimeStamp": "1702603755",
        "daoType": "flex"
      },
      {
        "id": "0x312cc9ea1b8705df689575ffd0d20e422eafe7e8",
        "daoAddr": "0x312cc9ea1b8705df689575ffd0d20e422eafe7e8",
        "daoName": "fd14-poll",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Thu Dec 14 2023 05:21:50",
        "createTimeStamp": "1702531310",
        "daoType": "flex"
      },
      {
        "id": "0x9544ebf80468f49981db6180cec9f76930a6ded1",
        "daoAddr": "0x9544ebf80468f49981db6180cec9f76930a6ded1",
        "daoName": "FlexT1214A",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Thu Dec 14 2023 01:18:05",
        "createTimeStamp": "1702516685",
        "daoType": "flex"
      },
      {
        "id": "0x2add369df034a1da2feafd77fc9f9aa0da63c797",
        "daoAddr": "0x2add369df034a1da2feafd77fc9f9aa0da63c797",
        "daoName": "VintageT1213A",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Wed Dec 13 2023 12:23:40",
        "createTimeStamp": "1702470220",
        "daoType": "vintage"
      },
      {
        "id": "0x0c082a2b026736ea6c21146d430e15aa51bebda5",
        "daoAddr": "0x0c082a2b026736ea6c21146d430e15aa51bebda5",
        "daoName": "FlexT1213B",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Wed Dec 13 2023 12:06:50",
        "createTimeStamp": "1702469210",
        "daoType": "flex"
      },
      {
        "id": "0xab9c6433d7dab1ca099ca540fe99270adbca2127",
        "daoAddr": "0xab9c6433d7dab1ca099ca540fe99270adbca2127",
        "daoName": "FlexT1213A",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Wed Dec 13 2023 09:12:45",
        "createTimeStamp": "1702458765",
        "daoType": "flex"
      },
      {
        "id": "0xcf1b4557f235226565f248f15da00227b0008851",
        "daoAddr": "0xcf1b4557f235226565f248f15da00227b0008851",
        "daoName": "fd123",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Dec 12 2023 09:58:00",
        "createTimeStamp": "1702375080",
        "daoType": "flex"
      },
      {
        "id": "0xf3d5768d69823f7b9233ad6b35f777227c1ec2c0",
        "daoAddr": "0xf3d5768d69823f7b9233ad6b35f777227c1ec2c0",
        "daoName": "fd1222",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Dec 12 2023 09:56:35",
        "createTimeStamp": "1702374995",
        "daoType": "flex"
      },
      {
        "id": "0x162cd3ef7a37f4ffc56ddab896b2de051caeb87c",
        "daoAddr": "0x162cd3ef7a37f4ffc56ddab896b2de051caeb87c",
        "daoName": "FlexT1212A",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Tue Dec 12 2023 07:22:30",
        "createTimeStamp": "1702365750",
        "daoType": "flex"
      },
      {
        "id": "0x8e44a67e4dcc71b5a953505d13baa28107faed12",
        "daoAddr": "0x8e44a67e4dcc71b5a953505d13baa28107faed12",
        "daoName": "f12-poll",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Dec 12 2023 06:46:25",
        "createTimeStamp": "1702363585",
        "daoType": "flex"
      },
      {
        "id": "0x3fe3683fe349d31e8599bdd43e49e474030e831c",
        "daoAddr": "0x3fe3683fe349d31e8599bdd43e49e474030e831c",
        "daoName": "fd122",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Dec 12 2023 04:32:05",
        "createTimeStamp": "1702355525",
        "daoType": "flex"
      },
      {
        "id": "0x45ba3260eb0cf8a3c1f8bdd193c54f325023c987",
        "daoAddr": "0x45ba3260eb0cf8a3c1f8bdd193c54f325023c987",
        "daoName": "fd13-",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Dec 12 2023 04:30:50",
        "createTimeStamp": "1702355450",
        "daoType": null
      },
      {
        "id": "0x034a34a69bec2ffe46d348f2f2e6b6e281ef0319",
        "daoAddr": "0x034a34a69bec2ffe46d348f2f2e6b6e281ef0319",
        "daoName": "fd12-",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Dec 12 2023 00:52:05",
        "createTimeStamp": "1702342325",
        "daoType": "flex"
      },
      {
        "id": "0x95cda18dacf046037cc28b06245d05a215fe2758",
        "daoAddr": "0x95cda18dacf046037cc28b06245d05a215fe2758",
        "daoName": "fd13",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Dec 12 2023 00:37:55",
        "createTimeStamp": "1702341475",
        "daoType": "flex"
      },
      {
        "id": "0x726bfc1dba817fa5db0f3745d884ea3bdd6f8976",
        "daoAddr": "0x726bfc1dba817fa5db0f3745d884ea3bdd6f8976",
        "daoName": "fd12",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Dec 12 2023 00:11:50",
        "createTimeStamp": "1702339910",
        "daoType": "flex"
      },
      {
        "id": "0xe1e9d92e2f38875a388a8d46a2563dc085235788",
        "daoAddr": "0xe1e9d92e2f38875a388a8d46a2563dc085235788",
        "daoName": "FlexT1208D",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Fri Dec 08 2023 08:59:25",
        "createTimeStamp": "1702025965",
        "daoType": "flex"
      },
      {
        "id": "0xfb0fcdf5ad59f9a66c355d46f4c026efb9a212ac",
        "daoAddr": "0xfb0fcdf5ad59f9a66c355d46f4c026efb9a212ac",
        "daoName": "FlexT1208C",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Fri Dec 08 2023 08:55:05",
        "createTimeStamp": "1702025705",
        "daoType": "flex"
      },
      {
        "id": "0x1afa6ee294ac4b2e7c14c22767ecfdf0ca444867",
        "daoAddr": "0x1afa6ee294ac4b2e7c14c22767ecfdf0ca444867",
        "daoName": "fd8",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Fri Dec 08 2023 08:40:50",
        "createTimeStamp": "1702024850",
        "daoType": "flex"
      },
      {
        "id": "0x365de45aa6299df2d0a94d2d777cfc976d07abc5",
        "daoAddr": "0x365de45aa6299df2d0a94d2d777cfc976d07abc5",
        "daoName": "FlexT1208B",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Fri Dec 08 2023 06:59:55",
        "createTimeStamp": "1702018795",
        "daoType": "flex"
      },
      {
        "id": "0x3f746fdce4d7b829117b5cb79715852133a4d31c",
        "daoAddr": "0x3f746fdce4d7b829117b5cb79715852133a4d31c",
        "daoName": "Lolicorn_1208D_flex",
        "creator": "0x5696cd4f07b08a9d9144c50e564aa5e10d94487d",
        "createDateTime": "Fri Dec 08 2023 06:42:35",
        "createTimeStamp": "1702017755",
        "daoType": "flex"
      },
      {
        "id": "0xc6ba10373486538bcd8ad530491fe24e9d4e91c8",
        "daoAddr": "0xc6ba10373486538bcd8ad530491fe24e9d4e91c8",
        "daoName": "Lolicorn_1208C_Flex",
        "creator": "0x5696cd4f07b08a9d9144c50e564aa5e10d94487d",
        "createDateTime": "Fri Dec 08 2023 06:38:15",
        "createTimeStamp": "1702017495",
        "daoType": "flex"
      },
      {
        "id": "0xbb056618d98a15f785f1bf781bf91fe4eabb05c1",
        "daoAddr": "0xbb056618d98a15f785f1bf781bf91fe4eabb05c1",
        "daoName": "FlexT1208A",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Fri Dec 08 2023 06:25:45",
        "createTimeStamp": "1702016745",
        "daoType": "flex"
      },
      {
        "id": "0x7d86911df045dfa199c4c2b40f6a79dc56e23715",
        "daoAddr": "0x7d86911df045dfa199c4c2b40f6a79dc56e23715",
        "daoName": "Lolicorn_1208B_Flex",
        "creator": "0x5696cd4f07b08a9d9144c50e564aa5e10d94487d",
        "createDateTime": "Fri Dec 08 2023 06:19:10",
        "createTimeStamp": "1702016350",
        "daoType": "flex"
      },
      {
        "id": "0x79a566d193582d7ae4d4bb7e5a3e400156ac41f2",
        "daoAddr": "0x79a566d193582d7ae4d4bb7e5a3e400156ac41f2",
        "daoName": "Lolicorn_1208_Flex",
        "creator": "0x5696cd4f07b08a9d9144c50e564aa5e10d94487d",
        "createDateTime": "Fri Dec 08 2023 06:07:25",
        "createTimeStamp": "1702015645",
        "daoType": "flex"
      },
      {
        "id": "0x7ca00e4e4931a62f09fe2f2f7eb3346af09023a1",
        "daoAddr": "0x7ca00e4e4931a62f09fe2f2f7eb3346af09023a1",
        "daoName": "Lolicorn_1207B_Vin",
        "creator": "0x7606cd95e031c47caf80cd6a9caa397e51fd5d7e",
        "createDateTime": "Thu Dec 07 2023 02:45:35",
        "createTimeStamp": "1701917135",
        "daoType": "vintage"
      },
      {
        "id": "0x8e7c5739ad0a9f62b4af607b20736cf5f6a41775",
        "daoAddr": "0x8e7c5739ad0a9f62b4af607b20736cf5f6a41775",
        "daoName": "Lolicorn_1207_Vin",
        "creator": "0x5696cd4f07b08a9d9144c50e564aa5e10d94487d",
        "createDateTime": "Thu Dec 07 2023 02:27:05",
        "createTimeStamp": "1701916025",
        "daoType": "vintage"
      },
      {
        "id": "0xd1ca42e3f8e25406a8b154e5fabab51e8a580695",
        "daoAddr": "0xd1ca42e3f8e25406a8b154e5fabab51e8a580695",
        "daoName": "FlexT1206C",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Wed Dec 06 2023 07:53:20",
        "createTimeStamp": "1701849200",
        "daoType": "flex"
      },
      {
        "id": "0xbc1d17a3758d73a3a0cdaef8452d5c12f892b75b",
        "daoAddr": "0xbc1d17a3758d73a3a0cdaef8452d5c12f892b75b",
        "daoName": "Lolicorn_1206C_Flex",
        "creator": "0x5696cd4f07b08a9d9144c50e564aa5e10d94487d",
        "createDateTime": "Wed Dec 06 2023 07:23:20",
        "createTimeStamp": "1701847400",
        "daoType": "flex"
      },
      {
        "id": "0xc41da670128da464473a56e813fe6cfd39d0f984",
        "daoAddr": "0xc41da670128da464473a56e813fe6cfd39d0f984",
        "daoName": "Lolicorn_1206B_Flex",
        "creator": "0x5696cd4f07b08a9d9144c50e564aa5e10d94487d",
        "createDateTime": "Wed Dec 06 2023 06:39:10",
        "createTimeStamp": "1701844750",
        "daoType": "flex"
      },
      {
        "id": "0xef05c9241736898a3e7a46ca0dda6fd1dd693102",
        "daoAddr": "0xef05c9241736898a3e7a46ca0dda6fd1dd693102",
        "daoName": "FlexT1206B",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Wed Dec 06 2023 05:39:55",
        "createTimeStamp": "1701841195",
        "daoType": "flex"
      },
      {
        "id": "0x01012bd9174010f46a2c7076546d6736536e2b0e",
        "daoAddr": "0x01012bd9174010f46a2c7076546d6736536e2b0e",
        "daoName": "Lolicorn_1206_Flex",
        "creator": "0x5696cd4f07b08a9d9144c50e564aa5e10d94487d",
        "createDateTime": "Wed Dec 06 2023 02:41:50",
        "createTimeStamp": "1701830510",
        "daoType": "flex"
      },
      {
        "id": "0x0242835518ff7a4535890972dd8657f270b3b97a",
        "daoAddr": "0x0242835518ff7a4535890972dd8657f270b3b97a",
        "daoName": "FlexT1206A",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Wed Dec 06 2023 02:36:45",
        "createTimeStamp": "1701830205",
        "daoType": "flex"
      },
      {
        "id": "0xe8caec6abf0a37628b4894f7692e5292c95fabc7",
        "daoAddr": "0xe8caec6abf0a37628b4894f7692e5292c95fabc7",
        "daoName": "fd6",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Wed Dec 06 2023 02:10:35",
        "createTimeStamp": "1701828635",
        "daoType": "flex"
      },
      {
        "id": "0xb3377a2717a28009030d25a3c859c5ea934bb067",
        "daoAddr": "0xb3377a2717a28009030d25a3c859c5ea934bb067",
        "daoName": "FlexT1205C",
        "creator": "0x06bc456535ec14669c1b116d339226faba08b429",
        "createDateTime": "Tue Dec 05 2023 06:11:50",
        "createTimeStamp": "1701756710",
        "daoType": null
      },
      {
        "id": "0x375e4fcea57e73162c4c390e4fea47b90f2bae8b",
        "daoAddr": "0x375e4fcea57e73162c4c390e4fea47b90f2bae8b",
        "daoName": "FlexT1205B",
        "creator": "0xe076e4d1fd530d83fefff596ac8d5d53c04054a3",
        "createDateTime": "Tue Dec 05 2023 03:47:25",
        "createTimeStamp": "1701748045",
        "daoType": null
      },
      {
        "id": "0x6b823d0d034d41cf8ed36f2030f04933437cfb97",
        "daoAddr": "0x6b823d0d034d41cf8ed36f2030f04933437cfb97",
        "daoName": "Lolicorn_1205_Flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Tue Dec 05 2023 03:33:20",
        "createTimeStamp": "1701747200",
        "daoType": null
      },
      {
        "id": "0xeb46c7570c45d2d68af6979b5b1836820559226c",
        "daoAddr": "0xeb46c7570c45d2d68af6979b5b1836820559226c",
        "daoName": "dadada",
        "creator": "0xe29de8c6088d241647e6456f8b4755a3d0f7c8b1",
        "createDateTime": "Tue Dec 05 2023 03:18:30",
        "createTimeStamp": "1701746310",
        "daoType": "vintage"
      },
      {
        "id": "0xdc17dca8ad01d83b8dee5cf4f650faf52ceffd2b",
        "daoAddr": "0xdc17dca8ad01d83b8dee5cf4f650faf52ceffd2b",
        "daoName": "FlexT1205A",
        "creator": "0xe076e4d1fd530d83fefff596ac8d5d53c04054a3",
        "createDateTime": "Tue Dec 05 2023 03:06:40",
        "createTimeStamp": "1701745600",
        "daoType": null
      },
      {
        "id": "0x41598912cf59f3fba7c0f5c681e9247ab2dd591b",
        "daoAddr": "0x41598912cf59f3fba7c0f5c681e9247ab2dd591b",
        "daoName": "fd444",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Mon Dec 04 2023 07:44:45",
        "createTimeStamp": "1701675885",
        "daoType": null
      },
      {
        "id": "0xc0f1690b49e44fc443644163c28c8d4a21dce7bb",
        "daoAddr": "0xc0f1690b49e44fc443644163c28c8d4a21dce7bb",
        "daoName": "Lolicorn_1204_Flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Mon Dec 04 2023 07:36:20",
        "createTimeStamp": "1701675380",
        "daoType": null
      },
      {
        "id": "0x44eb36ae223558676d8e6c2898c10f3acdc10e5f",
        "daoAddr": "0x44eb36ae223558676d8e6c2898c10f3acdc10e5f",
        "daoName": "fd44",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Mon Dec 04 2023 06:33:00",
        "createTimeStamp": "1701671580",
        "daoType": null
      },
      {
        "id": "0x5ef6891115def555f4245326621ecfac53fbcc7f",
        "daoAddr": "0x5ef6891115def555f4245326621ecfac53fbcc7f",
        "daoName": "fd4-",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Mon Dec 04 2023 04:52:15",
        "createTimeStamp": "1701665535",
        "daoType": null
      },
      {
        "id": "0x77073a4318c4f654af9b8bb66f42cf777bb0cebc",
        "daoAddr": "0x77073a4318c4f654af9b8bb66f42cf777bb0cebc",
        "daoName": "fd4",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Mon Dec 04 2023 04:11:15",
        "createTimeStamp": "1701663075",
        "daoType": null
      },
      {
        "id": "0x14c7ed956a9d1b539fd0a56f77d4066cf2f31ca4",
        "daoAddr": "0x14c7ed956a9d1b539fd0a56f77d4066cf2f31ca4",
        "daoName": "fd2",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Sat Dec 02 2023 09:58:30",
        "createTimeStamp": "1701511110",
        "daoType": null
      },
      {
        "id": "0x64561c3568372c6150cd8ad06ed8691c0be5766e",
        "daoAddr": "0x64561c3568372c6150cd8ad06ed8691c0be5766e",
        "daoName": "fn31",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Thu Nov 30 2023 10:57:50",
        "createTimeStamp": "1701341870",
        "daoType": null
      },
      {
        "id": "0x9de11bc2d6ae178103dfbc680fd7fbf27a0a8791",
        "daoAddr": "0x9de11bc2d6ae178103dfbc680fd7fbf27a0a8791",
        "daoName": "fn30-",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Thu Nov 30 2023 02:01:50",
        "createTimeStamp": "1701309710",
        "daoType": null
      },
      {
        "id": "0x6e512043bc2bf4dfb9ed149644c01a2cff715d62",
        "daoAddr": "0x6e512043bc2bf4dfb9ed149644c01a2cff715d62",
        "daoName": "fn30",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Thu Nov 30 2023 01:47:05",
        "createTimeStamp": "1701308825",
        "daoType": null
      },
      {
        "id": "0xd6ded8d1b72868d4cc6ddf9a88a9881913e5a622",
        "daoAddr": "0xd6ded8d1b72868d4cc6ddf9a88a9881913e5a622",
        "daoName": "fn29",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Wed Nov 29 2023 08:14:45",
        "createTimeStamp": "1701245685",
        "daoType": null
      },
      {
        "id": "0xc9970d5cfe2234aff96732b42758b530b03e9554",
        "daoAddr": "0xc9970d5cfe2234aff96732b42758b530b03e9554",
        "daoName": "Lolicorn_1129_Flex",
        "creator": "0xd9f04ec9a0ac241edc631cb0b44f11d17cd13bbe",
        "createDateTime": "Wed Nov 29 2023 03:57:40",
        "createTimeStamp": "1701230260",
        "daoType": null
      },
      {
        "id": "0x54be3efea03a5f539675e24e74a771b291c367ff",
        "daoAddr": "0x54be3efea03a5f539675e24e74a771b291c367ff",
        "daoName": "Lolicorn_1128_Flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Tue Nov 28 2023 04:53:05",
        "createTimeStamp": "1701147185",
        "daoType": null
      },
      {
        "id": "0xd522b00c3c2751187028f2916337b98808835dd1",
        "daoAddr": "0xd522b00c3c2751187028f2916337b98808835dd1",
        "daoName": "VintageT1127A",
        "creator": "0x9ac9c636404c8d46d9eb966d7179983ba5a3941a",
        "createDateTime": "Mon Nov 27 2023 23:49:40",
        "createTimeStamp": "1701128980",
        "daoType": "vintage"
      },
      {
        "id": "0xcbd5f49bb5c74128b37ad941242b006b694c466b",
        "daoAddr": "0xcbd5f49bb5c74128b37ad941242b006b694c466b",
        "daoName": "Lolicorn_1127_Vin",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Mon Nov 27 2023 03:43:25",
        "createTimeStamp": "1701056605",
        "daoType": "vintage"
      },
      {
        "id": "0xc2fd25fce093e2b33e2e83119682b84a5d8bdbde",
        "daoAddr": "0xc2fd25fce093e2b33e2e83119682b84a5d8bdbde",
        "daoName": "Lolicorn_1124_Vin_TEST",
        "creator": "0xd9f04ec9a0ac241edc631cb0b44f11d17cd13bbe",
        "createDateTime": "Fri Nov 24 2023 06:18:45",
        "createTimeStamp": "1700806725",
        "daoType": "vintage"
      },
      {
        "id": "0xa6406f5d7721829674a9586c99e9b9249c35eb2c",
        "daoAddr": "0xa6406f5d7721829674a9586c99e9b9249c35eb2c",
        "daoName": "vn24",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Fri Nov 24 2023 05:40:20",
        "createTimeStamp": "1700804420",
        "daoType": "vintage"
      },
      {
        "id": "0x240a08ed3639f7109cbd9ec689a8f76546497e8a",
        "daoAddr": "0x240a08ed3639f7109cbd9ec689a8f76546497e8a",
        "daoName": "Lolicorn_1124B_Flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Fri Nov 24 2023 05:24:40",
        "createTimeStamp": "1700803480",
        "daoType": null
      },
      {
        "id": "0x98f1248a5397c41688b38ed1007cf587bab6a1b0",
        "daoAddr": "0x98f1248a5397c41688b38ed1007cf587bab6a1b0",
        "daoName": "Lolicorn_1124_flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Fri Nov 24 2023 05:19:55",
        "createTimeStamp": "1700803195",
        "daoType": null
      },
      {
        "id": "0xf5bd968cb54a585b6d949c5625d574dbee8d1a9a",
        "daoAddr": "0xf5bd968cb54a585b6d949c5625d574dbee8d1a9a",
        "daoName": "VintageT1124A",
        "creator": "0x9ac9c636404c8d46d9eb966d7179983ba5a3941a",
        "createDateTime": "Fri Nov 24 2023 04:30:45",
        "createTimeStamp": "1700800245",
        "daoType": "vintage"
      },
      {
        "id": "0x9a48910da982d3dc4db8487c99b904e0974943d0",
        "daoAddr": "0x9a48910da982d3dc4db8487c99b904e0974943d0",
        "daoName": "fn24",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Fri Nov 24 2023 03:40:25",
        "createTimeStamp": "1700797225",
        "daoType": null
      },
      {
        "id": "0x17f443c7f9ad3932096c80f7cb70248e9f848bee",
        "daoAddr": "0x17f443c7f9ad3932096c80f7cb70248e9f848bee",
        "daoName": "Lolicorn_1124_Vin",
        "creator": "0xd9f04ec9a0ac241edc631cb0b44f11d17cd13bbe",
        "createDateTime": "Fri Nov 24 2023 02:38:45",
        "createTimeStamp": "1700793525",
        "daoType": "vintage"
      },
      {
        "id": "0x8607ba910cae2e1b7a3399290bc75e362db3bc4b",
        "daoAddr": "0x8607ba910cae2e1b7a3399290bc75e362db3bc4b",
        "daoName": "Lolicorn_1124_vin",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Fri Nov 24 2023 01:57:45",
        "createTimeStamp": "1700791065",
        "daoType": "vintage"
      },
      {
        "id": "0x0e1232c022a2cfbdabdae7755bda25149be1563f",
        "daoAddr": "0x0e1232c022a2cfbdabdae7755bda25149be1563f",
        "daoName": "Lolicorn_1123_Vin",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Thu Nov 23 2023 02:36:25",
        "createTimeStamp": "1700706985",
        "daoType": "vintage"
      },
      {
        "id": "0x812e47e5e75b32fa9ec8e0446a8e49fe3c89c4fd",
        "daoAddr": "0x812e47e5e75b32fa9ec8e0446a8e49fe3c89c4fd",
        "daoName": "Lolicorn_1122_Flex",
        "creator": "0xd9f04ec9a0ac241edc631cb0b44f11d17cd13bbe",
        "createDateTime": "Wed Nov 22 2023 09:18:45",
        "createTimeStamp": "1700644725",
        "daoType": null
      },
      {
        "id": "0xd8ae77c62478ae68538e63a3cdd79f11ef6bab60",
        "daoAddr": "0xd8ae77c62478ae68538e63a3cdd79f11ef6bab60",
        "daoName": "小豆泥11-22",
        "creator": "0xe29de8c6088d241647e6456f8b4755a3d0f7c8b1",
        "createDateTime": "Wed Nov 22 2023 08:59:20",
        "createTimeStamp": "1700643560",
        "daoType": "vintage"
      },
      {
        "id": "0xa434663b3b3f6cbf692ae6d5a122e54a2512f568",
        "daoAddr": "0xa434663b3b3f6cbf692ae6d5a122e54a2512f568",
        "daoName": "VintageT1122C",
        "creator": "0x9ac9c636404c8d46d9eb966d7179983ba5a3941a",
        "createDateTime": "Wed Nov 22 2023 08:41:40",
        "createTimeStamp": "1700642500",
        "daoType": "vintage"
      },
      {
        "id": "0xbca16bb7764835a24458a8462b1582b7ff47f3bf",
        "daoAddr": "0xbca16bb7764835a24458a8462b1582b7ff47f3bf",
        "daoName": "VintageT1121B",
        "creator": "0x9ac9c636404c8d46d9eb966d7179983ba5a3941a",
        "createDateTime": "Wed Nov 22 2023 08:22:50",
        "createTimeStamp": "1700641370",
        "daoType": "vintage"
      },
      {
        "id": "0x107ce919a3cd90e861e85de360541429cc9ee4cd",
        "daoAddr": "0x107ce919a3cd90e861e85de360541429cc9ee4cd",
        "daoName": "Lolicorn_1122_Vin",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Wed Nov 22 2023 08:07:45",
        "createTimeStamp": "1700640465",
        "daoType": "vintage"
      },
      {
        "id": "0xc5dcf0f75217ef2fa3ee8309d8bfec4bef6dd7ee",
        "daoAddr": "0xc5dcf0f75217ef2fa3ee8309d8bfec4bef6dd7ee",
        "daoName": "VintageT1122A",
        "creator": "0x9ac9c636404c8d46d9eb966d7179983ba5a3941a",
        "createDateTime": "Wed Nov 22 2023 07:59:20",
        "createTimeStamp": "1700639960",
        "daoType": "vintage"
      },
      {
        "id": "0x74042c854540c84c96f3b97e82410d8a426f2fd3",
        "daoAddr": "0x74042c854540c84c96f3b97e82410d8a426f2fd3",
        "daoName": "fn21",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Nov 21 2023 02:28:00",
        "createTimeStamp": "1700533680",
        "daoType": null
      },
      {
        "id": "0xadb448a3c1187c7a135b3b35afb6bdfd78e825e7",
        "daoAddr": "0xadb448a3c1187c7a135b3b35afb6bdfd78e825e7",
        "daoName": "g-fn21",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Nov 21 2023 02:10:35",
        "createTimeStamp": "1700532635",
        "daoType": null
      },
      {
        "id": "0xf067fca761041fe6f50c2f20dfcf19ae335f5129",
        "daoAddr": "0xf067fca761041fe6f50c2f20dfcf19ae335f5129",
        "daoName": "Lolicorn_1121_Vin",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Tue Nov 21 2023 01:45:40",
        "createTimeStamp": "1700531140",
        "daoType": "vintage"
      },
      {
        "id": "0xc2fc929829a65b125975513d0631770b66ff8c69",
        "daoAddr": "0xc2fc929829a65b125975513d0631770b66ff8c69",
        "daoName": "vn21",
        "creator": "0x9ab302974abd84c875343d6beea05309bede2f10",
        "createDateTime": "Tue Nov 21 2023 01:07:45",
        "createTimeStamp": "1700528865",
        "daoType": "vintage"
      },
      {
        "id": "0x4abdf696c10cd07efbd9989bf0bd633509350371",
        "daoAddr": "0x4abdf696c10cd07efbd9989bf0bd633509350371",
        "daoName": "VintageT1121A",
        "creator": "0x9ac9c636404c8d46d9eb966d7179983ba5a3941a",
        "createDateTime": "Tue Nov 21 2023 00:27:15",
        "createTimeStamp": "1700526435",
        "daoType": "vintage"
      },
      {
        "id": "0x8698b38550616dce9192f5ad9e777c13dbaa65b6",
        "daoAddr": "0x8698b38550616dce9192f5ad9e777c13dbaa65b6",
        "daoName": "tv1120",
        "creator": "0xcea5e66bec5193e5ec0b049a3fe5d7dd896fd480",
        "createDateTime": "Mon Nov 20 2023 07:37:55",
        "createTimeStamp": "1700465875",
        "daoType": "vintage"
      },
      {
        "id": "0x3d933b623c0c61fee48bb5eac0397cb752f1ee79",
        "daoAddr": "0x3d933b623c0c61fee48bb5eac0397cb752f1ee79",
        "daoName": "tf1120",
        "creator": "0xcea5e66bec5193e5ec0b049a3fe5d7dd896fd480",
        "createDateTime": "Mon Nov 20 2023 07:06:45",
        "createTimeStamp": "1700464005",
        "daoType": null
      },
      {
        "id": "0x7201fcdf558b4d7a553eec1b99aa14e7e76e901d",
        "daoAddr": "0x7201fcdf558b4d7a553eec1b99aa14e7e76e901d",
        "daoName": "Lolicorn_1120B_flex",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Mon Nov 20 2023 02:52:55",
        "createTimeStamp": "1700448775",
        "daoType": null
      },
      {
        "id": "0x807d3f5f0cbae3daa5282348f9b3591ab74be2a2",
        "daoAddr": "0x807d3f5f0cbae3daa5282348f9b3591ab74be2a2",
        "daoName": "Lolicorn_1120_Vin",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Mon Nov 20 2023 02:09:55",
        "createTimeStamp": "1700446195",
        "daoType": "vintage"
      },
      {
        "id": "0x70541ab80ed393f4a900e6169e173c916c673194",
        "daoAddr": "0x70541ab80ed393f4a900e6169e173c916c673194",
        "daoName": "Lolicorn_1117_vin",
        "creator": "0x9cfd17275c79305697334515eec1d86c93fd388a",
        "createDateTime": "Fri Nov 17 2023 01:44:15",
        "createTimeStamp": "1700185455",
        "daoType": "vintage"
      },
      {
        "id": "0xbf04790b025f7cb2b42c1cfb4f4decb84aea1999",
        "daoAddr": "0xbf04790b025f7cb2b42c1cfb4f4decb84aea1999",
        "daoName": "Lolicorn_1116_vin",
        "creator": "0x8043d4576b9f35acefbc913029684285037cf473",
        "createDateTime": "Thu Nov 16 2023 04:21:20",
        "createTimeStamp": "1700108480",
        "daoType": "vintage"
      },
      {
        "id": "0xeafee8a2ac1f48691b7a5f91de957a89cc4ceea6",
        "daoAddr": "0xeafee8a2ac1f48691b7a5f91de957a89cc4ceea6",
        "daoName": "tf11161",
        "creator": "0x1c9d74857d4adc3110741df349b6d3bf1f3c27fc",
        "createDateTime": "Thu Nov 16 2023 00:36:00",
        "createTimeStamp": "1700094960",
        "daoType": null
      },
      {
        "id": "0x03b3442c09563e2720ad1628deb191fff87f0f20",
        "daoAddr": "0x03b3442c09563e2720ad1628deb191fff87f0f20",
        "daoName": "tf16",
        "creator": "0x1c9d74857d4adc3110741df349b6d3bf1f3c27fc",
        "createDateTime": "Thu Nov 16 2023 00:34:15",
        "createTimeStamp": "1700094855",
        "daoType": "vintage"
      }
    ]
  }
}
*/