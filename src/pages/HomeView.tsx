import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardBody, CardFooter, VStack, InputGroup, InputLeftAddon, Input, Text, Wrap, WrapItem, Heading, Stack, StackDivider, Box, HStack, Button, Center, useToast, LinkBox, LinkOverlay, Flex, IconButton, Avatar, Icon, Spacer, Breadcrumb, BreadcrumbItem, Link, Spinner, InputRightElement, Progress, Divider, Tag, TagLeftIcon, TagLabel } from "@chakra-ui/react";
import { Dao_Filter, Dao_OrderBy, ListDaosQueryResDaos, listDaos } from '@daohaus/moloch-v3-data';
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { ViewData } from "../client/ViewData";
import { ChainsInfo } from "../client/ChainsInfo";
import { useNavigate } from "react-router-dom";
import { RoutesData } from "../client/RoutesData";
import { AragonIcon, ArbitrumIcon, CeloIcon, DAOSquareIcon, DAOhausIcon, EthereumIcon, GnosisIcon, OptimismIcon, PolygonIcon } from "../icons/Icons";
import { DAOInfo } from "../models/DAOInfo";
import { PlatformDataType, PlatformsData } from "../platforms/PlatformsData";
import { DAOhaus, DAOhausNetworkType, DAOhausPagingType, DAOhausUtils } from "../platforms/DAOhaus";
import { FaArrowLeft, FaArrowRight, FaChevronRight, FaHammer, FaHome, FaSearch, FaUserFriends } from "react-icons/fa";
import { IListQueryResults } from "@daohaus/data-fetch-utils";

const createPaging0 = (count_per_page: number = 20): DAOhausPagingType => {
    return { pageSize: count_per_page, offset: 0, lastId: undefined, previousPageLastId: undefined };
}

export const HomeView = () => {
    const CountPerPage: number = 20;
    const [daos, setDaos] = useState(new Array<DAOInfo>());
    const [currentPlatform, setCurrentPlatform] = useState(PlatformsData.daohaus as PlatformDataType);
    const [currentNetworkId, setCurrentNetworkId] = useState("");
    const [currentNetworkName, setCurrentNetworkName] = useState("[Select one network]");
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [currentPaging, setCurrentPaging] = useState(createPaging0(CountPerPage));
    const [nextPaging, setNextPaging] = useState(undefined as DAOhausPagingType);
    const [previousPaging, setPreviousPaging] = useState(undefined as DAOhausPagingType);
    const [queryParam, setQueryParam] = useState("");
    const [lastQueryParam, setLastQueryParam] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const switchPlatform = () => {}
    const onPlatformChanged = (newPlatform: PlatformDataType) => {}

    const switchNetwork = async (newNetworkId: DAOhausNetworkType, networkName: string) => {
        if (currentNetworkId === newNetworkId) return;
        setCurrentNetworkId(newNetworkId);
        setCurrentNetworkName(networkName);
        clearQuery();
        clearPaging();
        await loadDaos(newNetworkId);
    }

    const clearPaging = () => {
        setNextPaging(undefined);
        setPreviousPaging(undefined);
        setCurrentPageIndex(0);
        setCurrentPaging(createPaging0(CountPerPage));
    }

    const clearQuery = () => {
        setQueryParam("");
        setLastQueryParam("");
    }

    const nextPage = async () => {
        if (!nextPaging) return;
        // const pageIndex = currentPageIndex + 1;
        // setCurrentPageIndex(pageIndex);
        setCurrentPaging(nextPaging);
        await loadDaos(DAOhausUtils.getSupportedNetwork(currentNetworkId), queryParam.trim(), nextPaging);
    }

    const previousPage = async () => {
        if (!previousPaging) return;
        // const pageIndex = currentPageIndex - 1;
        // setCurrentPageIndex(pageIndex);
        setCurrentPaging(previousPaging);
        await loadDaos(DAOhausUtils.getSupportedNetwork(currentNetworkId), queryParam.trim(), previousPaging);
    }

    const search = async (param: string) => {
        const q = param.trim();
        if(lastQueryParam === q) {
            return;
        }

        clearPaging();
        setLastQueryParam(q);
        await loadDaos(DAOhausUtils.getSupportedNetwork(currentNetworkId), q);
    }

    const loadDaos = async (chainId: DAOhausNetworkType = "0x1", searchParam: string = "", paging = createPaging0(CountPerPage)) => {
        //setLastDaos(daos);
        //setDaos([]);
        setLoading(true);
        let res: IListQueryResults<Dao_OrderBy, Dao_Filter, ListDaosQueryResDaos>;
        // filter:
        // /mnt/e/github/dao-graph/node_modules/@daohaus/moloch-v3-data/src/subgraph/schema.generated.d.ts
        try {
            res = await listDaos({
                networkId: chainId,
                ordering: { orderBy: "createdAt", orderDirection: "desc" },
                filter: searchParam.length > 0 ? { name_contains_nocase: searchParam } : undefined,
                paging: paging,
                graphApiKeys: {
                    "0x1": "23b6fc3e2f8313a2ee6c04b4d443d3da",//eth
                    "0x5": "23b6fc3e2f8313a2ee6c04b4d443d3da",//goerli
                    "0x64": "23b6fc3e2f8313a2ee6c04b4d443d3da",//gnosis
                    "0x89": "23b6fc3e2f8313a2ee6c04b4d443d3da",//polygon
                    "0xa4b1": "23b6fc3e2f8313a2ee6c04b4d443d3da",//arb
                    "0xa": "23b6fc3e2f8313a2ee6c04b4d443d3da"//OP
                },
            });
            setNextPaging(old => res.nextPaging);
            setPreviousPaging(old => res.previousPaging);
        }
        finally {
            setLoading(false);
        }

        if (res.error) {
            toast({
                title: 'Error',
                description: res.error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        console.log(res);
        const daoPlatform = new DAOhaus();
        daoPlatform.parse(res.items);
        setDaos(daoPlatform.items);
    }

    const getNetworkIcon = () => {
        switch (currentNetworkId) {
            case ChainsInfo.ethereum.mainnet.requestParams.chainId:
                return EthereumIcon;
            case ChainsInfo.arbitrum.mainnet.requestParams.chainId:
                return ArbitrumIcon;
            case ChainsInfo.gnosis.mainnet.requestParams.chainId:
                return GnosisIcon;
            case ChainsInfo.optimism.mainnet.requestParams.chainId:
                return OptimismIcon;
            case ChainsInfo.polygon.mainnet.requestParams.chainId:
                return PolygonIcon;
        }
        return EthereumIcon;
    }

    // useEffect(() => {
    //     // React advises to declare the async function directly inside useEffect
    //     // async function loadData() {
    //     // };
    //     // You need to restrict it at some point
    //     // This is just dummy code and should be replaced by actual
    //     //loadDaos();
    // }, []);

    return (
        <VStack spacing={4}>
            <NavBar onPlatformChanged={onPlatformChanged} />
            <Divider/>
            <Flex w="100%" minHeight="500px">
                <Box m={1} width="80px">
                    <VStack>
                        <IconButton isRound={true}
                            variant='solid' colorScheme='teal' aria-label='DAOhaus' fontSize='20px'
                            icon={<DAOhausIcon />}
                        />
                        <IconButton isRound={true}
                            variant='solid' colorScheme='teal' aria-label='Aragon' fontSize='20px'
                            icon={<AragonIcon />}
                            isDisabled={true} />
                        <IconButton isRound={true}
                            variant='solid' colorScheme='teal' aria-label='DAOSquare' fontSize='20px'
                            icon={<DAOSquareIcon />}
                            isDisabled={true} />
                    </VStack>
                </Box>
                <Divider orientation="vertical"/>
                <Box m={1} width="100%">
                    <Flex alignItems="center" mb={3}>
                        <Breadcrumb spacing='8px' mb="10px" separator={<FaChevronRight color='gray.500' />}>
                            <BreadcrumbItem><FaHome /></BreadcrumbItem>
                            <BreadcrumbItem>
                                <Text>{currentPlatform.name}</Text>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Text>{currentNetworkName}</Text>
                            </BreadcrumbItem>
                        </Breadcrumb>
                        {loading ? <Spinner ml="8px" /> : null}
                        <Spacer />
                        <HStack spacing='5px'>
                            <IconButton isRound={true} isDisabled={currentNetworkId === "0x1"}
                                variant='solid' bg="transparent"
                                title="Ethereum" aria-label='Ethereum' fontSize='20px'
                                icon={<EthereumIcon />}
                                onClick={e => switchNetwork("0x1", "Ethereum")} />
                            <IconButton isRound={true} isDisabled={currentNetworkId === "0xa4b1"}
                                variant='solid' bg="transparent"
                                title="Arbitrum" aria-label='Arbitrum' fontSize='20px'
                                icon={<ArbitrumIcon />}
                                onClick={e => switchNetwork("0xa4b1", "Arbitrum")} />
                            {/* <IconButton isRound={true} isDisabled={currentNetworkId === ""}
                                variant='solid' bg="transparent"
                                title="Celo" aria-label='Celo' fontSize='20px'
                                icon={<CeloIcon />} /> */}
                            <IconButton isRound={true} isDisabled={currentNetworkId === "0x64"}
                                variant='solid' bg="transparent"
                                title="Gnosis" aria-label='Gnosis' fontSize='20px'
                                icon={<GnosisIcon />}
                                onClick={e => switchNetwork("0x64", "Gnosis")} />
                            <IconButton isRound={true} isDisabled={currentNetworkId === "0xa"}
                                variant='solid' bg="transparent"
                                title="OP" aria-label='OP' fontSize='20px'
                                icon={<OptimismIcon />}
                                onClick={e => switchNetwork("0xa", "Optimism")} />
                            <IconButton isRound={true} isDisabled={currentNetworkId === "0x89"}
                                variant='solid' bg="transparent"
                                title="Polygon" aria-label='Polygon' fontSize='20px'
                                icon={<PolygonIcon />}
                                onClick={e => switchNetwork("0x89", "Polygon")} />
                        </HStack>
                    </Flex>
                    {currentNetworkId.length === 0 ? <Center bg='#4338ca' h='200px' color='white'>
                        <Heading as="h2" size='2xl'>Choose a network to start!</Heading>
                    </Center> : <Flex alignItems='center' gap='2' h="50px">
                        <IconButton isRound={true} isDisabled={previousPaging === undefined}
                            variant='outline' colorScheme='#4f46e5' aria-label='Previous Page' title="Previous Page" fontSize='20px'
                            icon={<FaArrowLeft />}
                            onClick={previousPage}/>
                        <InputGroup w="240px">
                            <Input placeholder='Search DAO Name' type="text" value={queryParam}
                                onChange={(e) => { setQueryParam( old => e.target.value.toLowerCase()); } }
                                onKeyUp={(e) => {
                                    if(e.key === "Enter"){ search(queryParam); }
                                }}/>
                            <InputRightElement>
                                <FaSearch />
                            </InputRightElement>
                        </InputGroup>
                        <IconButton isRound={true} isDisabled={nextPaging === undefined}
                            variant='outline' colorScheme='#4f46e5' aria-label='Next Page' title="Next Page" fontSize='20px'
                            icon={<FaArrowRight />}
                            onClick={nextPage}/>
                        <Spacer/>
                    </Flex>}
                    {currentNetworkId.length > 0 && loading ? <Center h='250px' px={7}>
                        <Progress size='xs' w="100%" isIndeterminate />
                    </Center> : null }
                    {currentNetworkId.length > 0 && !loading && daos.length === 0 ? <Center bg='#4338ca' h='250px'>
                        <VStack spacing="40px">
                            <Heading as="h2" size='2xl' color='#c7d2fe'>OOPS! Found nothing!</Heading>
                            <Link color='#eef2ff' target="_blank" href="https://summon.daohaus.club/">
                                <Heading as="h2" size='2xl'>👉 Let's summon a DAO! 👈</Heading>
                            </Link>
                        </VStack>
                    </Center> : <Wrap spacing='30px'>
                        {daos.map((item: DAOInfo, index: number) => (
                            <WrapItem key={index}>
                                <Card width="260px" height="320px">
                                    <CardHeader title={item.name}>
                                        <Flex flex='1' gap='4' alignItems='center'>
                                            <Avatar name={item.name} src={item.avatar} />
                                            <Heading size='sm' textOverflow="ellipsis">
                                                <Link target="_blank" href={`https://admin.daohaus.club/#/molochv3/${currentNetworkId}/${item.id}`}>{item.name}</Link>
                                            </Heading>
                                        </Flex>
                                    </CardHeader>
                                    <CardBody>
                                        <Stack divider={<StackDivider />} spacing='4'>
                                            <Box>
                                                <Heading size='xs' textTransform='uppercase'>Bio</Heading>
                                                <Text pt='2' fontSize='sm' height="110px" overflowY="auto">{item.description}</Text>
                                            </Box>
                                        </Stack>
                                    </CardBody>
                                    <CardFooter justify='space-between'>
                                        <Icon as={getNetworkIcon()} boxSize={6} />
                                        <Box display='flex' alignItems="center" title="Count of Members">
                                            <Icon as={FaUserFriends} />
                                            <Text ml={2}>{item.activeMemberCount}</Text>
                                        </Box>
                                        <Box display='flex' alignItems="center" title="Count of Proposals">
                                            <Icon as={FaHammer} />
                                            <Text ml={2}>{item.proposalCount}</Text>
                                        </Box>
                                    </CardFooter>
                                </Card>
                            </WrapItem>
                        ))}
                    </Wrap>}
                    {currentNetworkId.length === 0 ? null : <Flex alignItems='center' gap='2' h="50px">
                        <Spacer />
                        <IconButton isRound={true} isDisabled={previousPaging === undefined}
                            variant='outline' colorScheme='#4f46e5' aria-label='Previous Page' title="Previous Page" fontSize='20px'
                            icon={<FaArrowLeft />}
                            onClick={previousPage}/>
                        <IconButton isRound={true} isDisabled={nextPaging === undefined}
                            variant='outline' colorScheme='#4f46e5' aria-label='Next Page' title="Next Page" fontSize='20px'
                            icon={<FaArrowRight />}
                            onClick={nextPage}/>
                    </Flex>}
                </Box>
            </Flex>
            <Footer />
        </VStack>
    );
}