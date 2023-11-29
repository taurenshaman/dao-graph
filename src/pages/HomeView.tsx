import React, { useEffect, useState } from "react"
import {
    Card, CardHeader, CardBody, CardFooter,
    VStack,
    InputGroup,
    InputLeftAddon,
    Input,
    Text,
    Wrap,
    WrapItem,
    Heading,
    Stack,
    StackDivider,
    Box,
    HStack,
    Button,
    Center,
    useToast,
    LinkBox,
    LinkOverlay,
    Flex,
    IconButton,
    Avatar,
    Icon
} from "@chakra-ui/react";
import { listDaos } from '@daohaus/moloch-v3-data';
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { ViewData } from "../client/ViewData";
import { useNavigate } from "react-router-dom";
import { RoutesData } from "../client/RoutesData";
import { AragonIcon, DAOSquareIcon, DAOhausIcon, EthereumIcon } from "../icons/Icons";
import { DAOInfo } from "../models/DAOInfo";
import { DAOhaus } from "../platforms/DAOhaus";
import { FaHammer, FaUserFriends } from "react-icons/fa";

export const HomeView = () => {
    const [daos, setDaos] = useState(new Array<DAOInfo>());
    const navigate = useNavigate();
    const toast = useToast();
    let networkIcon = EthereumIcon;

    const loadDaos = async (chainId: "0x1" | "0x5" | "0x64" | "0xa" | "0x89" | "0xa4b1" = "0x1") => {
        setDaos([]);
        const res = await listDaos({
            networkId: chainId,
            graphApiKeys: {
                "0x1": '23b6fc3e2f8313a2ee6c04b4d443d3da',
            },
        });
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
        console.log(res.items);
        const daoPlatform = new DAOhaus();
        daoPlatform.parse(res.items);
        setDaos(daoPlatform.items);
    }

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // async function loadData() {
        // };
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        loadDaos();
    }, []);

    return (
        <VStack spacing={4}>
            <NavBar />
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
                <Box m={1}>
                    <Wrap spacing='30px'>
                        {daos.map((item: DAOInfo, index: number) => (
                            <WrapItem key={index}>
                                <Card width="260px" height="320px">
                                    <CardHeader title={item.name}>
                                        <Flex flex='1' gap='4' alignItems='center'>
                                            <Avatar name={item.name} src={item.avatar} />
                                            <Heading size='sm' textOverflow="ellipsis">{item.name}</Heading>
                                        </Flex>
                                    </CardHeader>
                                    <CardBody>
                                        <Stack divider={<StackDivider />} spacing='4'>
                                            <Box>
                                                <Heading size='xs' textTransform='uppercase'>Bio</Heading>
                                                <Text pt='2' fontSize='sm' height="110px" overflowY="scroll">{item.description}</Text>
                                            </Box>
                                        </Stack>
                                    </CardBody>
                                    <CardFooter justify='space-between'>
                                        <Icon as={networkIcon} boxSize={6}/>
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
                    </Wrap>
                </Box>
            </Flex>
            {/* <Wrap spacing='30px' justify='center'>
                <WrapItem>
                    <Card width="260px" height="310px">
                        <CardHeader>
                            <Heading size='md'>Algorand</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Center>
                                    <Heading size="3xl"><AlgoIcon /></Heading>
                                </Center>
                                <Box>
                                    <HStack>
                                        <Button onClick={connectMyAlgo}>MyAlgo</Button>
                                    </HStack>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </WrapItem>
                <WrapItem>
                    <Card width="260px" height="310px">
                        <CardHeader>
                            <Heading size='md'>Arweave</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Center>
                                    <Heading size="3xl"><ArIcon /></Heading>
                                </Center>
                                <Box>
                                    <HStack>
                                        <Button onClick={connectAr}>Injected</Button>
                                    </HStack>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </WrapItem>
                <WrapItem>
                    <Card width="260px" height="310px">
                        <CardHeader>
                            <Heading size='md'>Cosmos</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Center>
                                    <Heading size="3xl"><AtomIcon /></Heading>
                                </Center>
                                <Box>
                                    <HStack>
                                        <Button onClick={connectKeplr}>Keplr</Button>
                                    </HStack>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </WrapItem>
                <WrapItem>
                    <Card width="260px" height="310">
                        <CardHeader>
                            <Heading size='md'>Ethereum</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Center>
                                    <Heading size="3xl"><EthIcon /></Heading>
                                </Center>
                                <Box>
                                    <HStack>
                                        <Button onClick={connectEth}>Injected</Button>
                                    </HStack>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </WrapItem>
                {/* <WrapItem>
                    <Card width="260px" height="310px">
                        <CardHeader>
                            <Heading size='md'>JoyID</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Center>
                                    <Heading size="3xl"><JoyIDIcon /></Heading>
                                </Center>
                                <Box>
                                    <HStack>
                                        <Button onClick={connectJoyID}>CKB: Testnet</Button>
                                    </HStack>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </WrapItem>
                <WrapItem>
                    <Card width="260px" height="310px">
                        <CardHeader>
                            <Heading size='md'>Nervos</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Center>
                                    <Heading size="3xl"><CkbIcon /></Heading>
                                </Center>
                                <Box>
                                    <HStack>
                                        <Button onClick={connectJoyID}>JoyID: Testnet</Button>
                                        <Button onClick={connectPW}>PW (Incompatible with CKB)</Button>
                                    </HStack>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </WrapItem>
                <WrapItem>
                    <Card width="260px" height="310px">
                        <CardHeader>
                            <Heading size='md'>Polkadot</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Center>
                                    <Heading size="3xl"><DotIcon /></Heading>
                                </Center>
                                <Box>
                                    <HStack>
                                        <Button onClick={connectDot}>Web3</Button>
                                    </HStack>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </WrapItem>
                <WrapItem>
                    <Card width="260px" height="310px">
                        <CardHeader>
                            <Heading size='md'>Solana</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Center>
                                    <Heading size="3xl"><SolIcon /></Heading>
                                </Center>
                                <Box>
                                    <HStack>
                                        <Button onClick={connectSolana}>Injected</Button>
                                    </HStack>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </WrapItem>
                <WrapItem>
                    <Card width="260px" height="310px">
                        <CardHeader>
                            <Heading size='md'>Stacks</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Center>
                                    <Heading size="3xl"><StacksIcon /></Heading>
                                </Center>
                                <Box>
                                    <HStack>
                                        <Button onClick={connectStacks}>Injected</Button>
                                    </HStack>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </WrapItem>
                <WrapItem>
                    <Card width="260px" height="310px">
                        <CardHeader>
                            <Heading size='md'>Tron</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="4">
                                <Center>
                                    <Heading size="3xl"><TrxIcon /></Heading>
                                </Center>
                                <Box>
                                    <HStack>
                                        <Button onClick={connectTron}>Injected</Button>
                                    </HStack>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </WrapItem>
            </Wrap>
            <Center margin="50px;">
                <Heading size="xl">Smart Contract Wallets</Heading>
            </Center>
            <Wrap spacing='30px' justify='center'>
                <WrapItem>
                    <LinkBox as='article' maxW='sm' p='5' borderWidth='1px' rounded='md'
                        width="200px" height="200px" cursor="pointer">
                        <Heading size="md" my="2">
                            <LinkOverlay onClick={connectUniPassWallet}>UniPass Wallet</LinkOverlay>
                        </Heading>
                        <Center marginTop="40px">
                            <Heading size="3xl"><UnipassIcon /></Heading>
                        </Center>
                    </LinkBox>
                </WrapItem>
            </Wrap> */}
            <Footer />
        </VStack>
    );
}