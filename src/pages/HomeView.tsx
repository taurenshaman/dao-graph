import React, { useEffect, useState } from "react"
import { chakra, Card, CardHeader, CardBody, CardFooter, VStack, InputGroup, InputLeftAddon, Input, Text, Wrap, WrapItem, Heading, Stack, StackDivider, Box, HStack, Button, Center, useToast, LinkBox, LinkOverlay, Flex, IconButton, Avatar, Icon, Spacer, Breadcrumb, BreadcrumbItem, Link, Spinner, InputRightElement, Progress, Divider, Tag, TagLeftIcon, TagLabel } from "@chakra-ui/react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { ViewData } from "../client/ViewData";
import { ChainsInfo } from "../client/ChainsInfo";
import { useNavigate } from "react-router-dom";
import { RoutesData } from "../client/RoutesData";
import { AragonIcon, ArbitrumIcon, CeloIcon, DAOSquareIcon, DAOhausIcon, EthereumIcon, GnosisIcon, OptimismIcon, PolygonIcon } from "../icons/Icons";
import coverSvg from "../icons/cover.svg";
import { DAOInfo } from "../models/DAOInfo";
import { PlatformDataType, PlatformsData } from "../platforms/PlatformsData";
import { DAOhaus } from "../platforms/DAOhaus";
import { DAOSquare } from "../platforms/DAOSquare";
import { FaArrowLeft, FaArrowRight, FaChevronRight, FaHammer, FaHome, FaSearch, FaUserFriends } from "react-icons/fa";
import { PlatformBase } from "../platforms/PlatformBase";

export const HomeView = () => {
    const EmptyNetworkName = "[Select one network]";
    const [daos, setDaos] = useState(new Array<DAOInfo>());
    const [platform, setPlatform] = useState(undefined as PlatformBase | undefined);
    const [platformData, setPlatformData] = useState(PlatformsData.daohaus as PlatformDataType);
    const [currentNetworkId, setCurrentNetworkId] = useState("");
    const [currentNetworkName, setCurrentNetworkName] = useState(EmptyNetworkName);
    const [supportedChains, setSupportedChains] = useState(new Array<string>());
    const [queryParam, setQueryParam] = useState("");
    const [lastQueryParam, setLastQueryParam] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const switchPlatform = (newPlatform: PlatformBase, data: PlatformDataType) => {
        if(platform && platform.id === newPlatform.id) { return; }
        setPlatformData(data);
        setPlatform(newPlatform);
        setSupportedChains(newPlatform.supportedChains);
        setCurrentNetworkId("");
        setCurrentNetworkName(EmptyNetworkName);
        clearQuery();
    }

    const switchNetwork = async (newNetworkId: string, networkName: string) => {//DAOhausNetworkType
        if (currentNetworkId === newNetworkId) return;
        setCurrentNetworkId(newNetworkId);
        setCurrentNetworkName(networkName);
        clearQuery();

        platform?.switChain(newNetworkId);
        await search(queryParam, false);
    }

    const supportChain = (chainId: string) => {
        return currentNetworkId === chainId || supportedChains.indexOf(chainId) < 0;
    }

    const clearQuery = () => {
        setQueryParam("");
        setLastQueryParam("");
        setDaos([]);
    }

    const nextPage = async () => {
        if (!platform || !platform.canLoadNextPage()) return;

        try {
            setLoading(true);
            await platform.loadDaosNext(queryParam.trim());
            setDaos(platform.items);
        }
        finally {
            setLoading(false);
        }
    }

    const previousPage = async () => {
        if (!platform || !platform.canLoadPreviousPage()) return;

        try {
            setLoading(true);
            await platform.loadDaosPrevious(queryParam.trim());
            setDaos(platform.items);
        }
        finally {
            setLoading(false);
        }
    }

    const search = async (param: string, checkLastSearch: boolean = true) => {
        const q = param.trim();
        if (!platform) { return; }
        if(checkLastSearch && lastQueryParam === q){ return; }

        setLastQueryParam(q);
        platform?.clearPaging();
        try {
            setLoading(true);
            await platform.loadDaos(q);
            setDaos(platform.items);
        }
        finally {
            setLoading(false);
        }
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

    const renderNetworks = () => {
        return (
            <HStack spacing='5px'>
                <IconButton isRound={true} isDisabled={supportChain(ChainsInfo.ethereum.mainnet.requestParams.chainId)}
                    variant='solid' bg="transparent"
                    title="Ethereum" aria-label='Ethereum' fontSize='20px'
                    icon={<EthereumIcon />}
                    onClick={e => switchNetwork(ChainsInfo.ethereum.mainnet.requestParams.chainId, ChainsInfo.ethereum.name)} />
                <IconButton isRound={true} isDisabled={supportChain(ChainsInfo.arbitrum.mainnet.requestParams.chainId)}
                    variant='solid' bg="transparent"
                    title="Arbitrum" aria-label='Arbitrum' fontSize='20px'
                    icon={<ArbitrumIcon />}
                    onClick={e => switchNetwork(ChainsInfo.arbitrum.mainnet.requestParams.chainId, ChainsInfo.arbitrum.name)} />
                <IconButton isRound={true} isDisabled={supportChain(ChainsInfo.base.mainnet.requestParams.chainId)}
                    variant='solid' bg="transparent"
                    title="Base" aria-label='Base' fontSize='20px'
                    icon={<CeloIcon />}
                    onClick={e => switchNetwork(ChainsInfo.base.mainnet.requestParams.chainId, ChainsInfo.base.name)} />
                <IconButton isRound={true} isDisabled={supportChain(ChainsInfo.gnosis.mainnet.requestParams.chainId)}
                    variant='solid' bg="transparent"
                    title="Gnosis" aria-label='Gnosis' fontSize='20px'
                    icon={<GnosisIcon />}
                    onClick={e => switchNetwork(ChainsInfo.gnosis.mainnet.requestParams.chainId, ChainsInfo.gnosis.name)} />
                <IconButton isRound={true} isDisabled={supportChain(ChainsInfo.optimism.mainnet.requestParams.chainId)}
                    variant='solid' bg="transparent"
                    title="OP" aria-label='OP' fontSize='20px'
                    icon={<OptimismIcon />}
                    onClick={e => switchNetwork(ChainsInfo.optimism.mainnet.requestParams.chainId, ChainsInfo.optimism.name)} />
                <IconButton isRound={true} isDisabled={supportChain(ChainsInfo.polygon.mainnet.requestParams.chainId)}
                    variant='solid' bg="transparent"
                    title="Polygon" aria-label='Polygon' fontSize='20px'
                    icon={<PolygonIcon />}
                    onClick={e => switchNetwork(ChainsInfo.polygon.mainnet.requestParams.chainId, ChainsInfo.polygon.name)} />
            </HStack>
        );
    }

    const init = () => {
        if(!platform){
            // const p = new DAOhaus(PlatformsData.daohaus.supportedChains);
            // setPlatform(p);
            switchPlatform(new DAOhaus(PlatformsData.daohaus.supportedChains), PlatformsData.daohaus);
        }
    }

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // async function loadData() {
        // };
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        init();
    }, []);
    // isDisabled={platform && platform.id === "daosquare"}
    return (
        <VStack spacing={4}>
            <NavBar platformData={platformData} />
            <Divider />
            <Flex w="100%" minHeight="500px">
                <Box m={1} width="80px">
                    <VStack>
                        <IconButton isRound={true}
                            variant='solid' colorScheme='teal' aria-label='DAOhaus' fontSize='20px'
                            icon={<DAOhausIcon />}
                            onClick={(e) => {
                                switchPlatform(new DAOhaus(PlatformsData.daohaus.supportedChains), PlatformsData.daohaus);
                            }} />
                        <IconButton isRound={true}
                            variant='solid' colorScheme='teal' aria-label='Aragon' fontSize='20px'
                            icon={<AragonIcon />}
                            isDisabled={true}
                            onClick={(e) => {
                                //switchPlatform(new DAOSquare(PlatformsData.aragon.supportedChains), PlatformsData.aragon);
                            }} />
                        <IconButton isRound={true}
                            variant='solid' colorScheme='teal' aria-label='DAOSquare' fontSize='20px'
                            icon={<DAOSquareIcon />} 
                            onClick={(e) => {
                                switchPlatform(new DAOSquare(PlatformsData.daosquare.supportedChains), PlatformsData.daosquare);
                            }} />
                    </VStack>
                </Box>
                <Divider orientation="vertical" />
                <Box m={1} width="100%">
                    <Flex alignItems="center" mb={3}>
                        <Breadcrumb spacing='8px' mb="10px" separator={<FaChevronRight color='gray.500' />}>
                            <BreadcrumbItem><FaHome /></BreadcrumbItem>
                            <BreadcrumbItem>
                                <Text>{platformData.name}</Text>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Text>{currentNetworkName}</Text>
                            </BreadcrumbItem>
                        </Breadcrumb>
                        {loading ? <Spinner ml="8px" /> : null}
                        <Spacer />
                        {renderNetworks()}
                    </Flex>
                    {currentNetworkId.length === 0 ?
                        // <Center bg='#4338ca' h='200px' color='white'>
                        //     <Heading as="h2" size='2xl'>Choose a network to start!</Heading>
                        // </Center>
                        <VStack>
                            <chakra.img src={coverSvg} />
                            <Heading as="h2" size='2xl' mt={5} mb={5}>Choose a network to start!</Heading>
                            <Center>
                            {renderNetworks()}
                            </Center>
                        </VStack>
                        : <Flex alignItems='center' gap='2' h="50px" mb={3}>
                            <IconButton isRound={true} isDisabled={!platform || !platform.canLoadPreviousPage()}
                                variant='outline' colorScheme='#4f46e5' aria-label='Previous Page' title="Previous Page" fontSize='20px'
                                icon={<FaArrowLeft />}
                                onClick={previousPage} />
                            <InputGroup w="240px">
                                <Input placeholder='Search DAO Name' type="text" value={queryParam}
                                    onChange={(e) => { setQueryParam(old => e.target.value.toLowerCase()); }}
                                    onKeyUp={(e) => {
                                        if (e.key === "Enter") { search(queryParam); }
                                    }} />
                                <InputRightElement>
                                    <FaSearch />
                                </InputRightElement>
                            </InputGroup>
                            <IconButton isRound={true} isDisabled={!platform || !platform.canLoadNextPage()}
                                variant='outline' colorScheme='#4f46e5' aria-label='Next Page' title="Next Page" fontSize='20px'
                                icon={<FaArrowRight />}
                                onClick={nextPage} />
                            <Spacer />
                        </Flex>}
                    {currentNetworkId.length > 0 && loading ? <Center h='250px' px={7}>
                        <Progress size='xs' w="100%" isIndeterminate />
                    </Center> : null}
                    {currentNetworkId.length > 0 && !loading && daos.length === 0 ? <Center bg='#4338ca' h='250px'>
                        <VStack spacing="40px">
                            <Heading as="h2" size='2xl' color='#c7d2fe'>OOPS! Found nothing!</Heading>
                            <Link color='#eef2ff' target="_blank" href={platform?.linkOfCreateDAO}>
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
                                                <Link target="_blank" href={platform?.getLinkOfDAO(item.id)}>{item.name}</Link>
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
                        <IconButton isRound={true} isDisabled={!platform || !platform.canLoadPreviousPage()}
                            variant='outline' colorScheme='#4f46e5' aria-label='Previous Page' title="Previous Page" fontSize='20px'
                            icon={<FaArrowLeft />}
                            onClick={previousPage} />
                        <IconButton isRound={true} isDisabled={!platform || !platform.canLoadNextPage()}
                            variant='outline' colorScheme='#4f46e5' aria-label='Next Page' title="Next Page" fontSize='20px'
                            icon={<FaArrowRight />}
                            onClick={nextPage} />
                    </Flex>}
                </Box>
            </Flex>
            <Footer />
        </VStack>
    );
}