import React from 'react';
import { Link as ReactLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Link, Container, useDisclosure, Stack, HStack, IconButton, Menu, MenuButton, Button, MenuList, MenuItem, Spinner, Text, useToast, Avatar, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, MenuGroup, MenuDivider, } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Logo } from '../icons/Logo';
import { RoutesData } from '../client/RoutesData';
import { FaCross, FaHamburger } from 'react-icons/fa';
import { ViewData } from '../client/ViewData';
import { ViewModelBridge } from '../client/ViewModelBridge';
import { JoyIDIcon, MetaMaskIcon } from '../icons/Icons';
// import { EthWallet } from '../accounts/EthWallet';
// import { JoyIDEvmWallet } from '../accounts/JoyIDEvmWallet';
// import { Wallet } from '../accounts/Wallet';
// import { DotbitContext } from '../chains/DotbitContext';

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenOverlay, onOpen: onOpenOverlay, onClose: onCloseOverlay } = useDisclosure();
  const [account, setAccount] = React.useState(ViewData.wallet?.account || "");
  const [displayName, setDisplayName] = React.useState("");
  const nav = useNavigate();
  const toast = useToast();

  const getDIDs = async () => {
    // const cxtDotbit = new DotbitContext();
    // try {
    //   await cxtDotbit.useAddress(ViewData.ethAddress);
    // }
    // finally { }

    // const cxtEns = new ENSContext(provider);
    // try {
    //   await cxtEns.useAddress(ViewData.eth);
    //   ViewData.did.ens = cxtEns.did;
    //   ViewMdoelBridge.ENSContext = cxtEns;
    // }
    // finally { }

    // ViewData.did = cxtDotbit.did || account.substring(account.length - 4);
    // setDisplayName(ViewData.did);

    // console.log(`DID: ${ViewData.did}`);
  };
  // const afterConnected = (wallet: Wallet, addr: string) => {
  //   setAccount(addr);
  //   console.log(`${addr} logged in.`);

  //   ViewData.connected = true;
  //   ViewData.wallet = wallet;
  //   if (ViewModelBridge.afterConnected)
  //     ViewModelBridge.afterConnected();
  // }

  // const connectEvmWithJoyID = async () => {
  //   const wallet = new JoyIDEvmWallet();
  //   const addr = await wallet.connect();
  //   ViewData.ethAddress = wallet.account;
  //   afterConnected(wallet, addr);
  //   //await getDIDs();
  //   //nav(RoutesData.Address);
  // }
  // const connectEth = async () => {
  //   const wallet = new EthWallet();
  //   const addr = await wallet.connect();
  //   ViewData.ethAddress = wallet.account;
  //   afterConnected(wallet, addr);
  //   await getDIDs();

  //   //nav(RoutesData.Start);
  // }

  const tryDisconnect = async () => {
    setAccount("");
    ViewData.wallet = null;
    ViewData.ethAddress = "";
    ViewData.connected = false;

    if (ViewModelBridge.afterDisConnected)
      ViewModelBridge.afterDisConnected();

    nav(RoutesData.Home);
  }

  return (
    <>
      <Box w="100%" px={4}>
        {/* <Container as={Stack}></Container> */}
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8}>
            <Logo boxSize={12} title="Creator" />
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link as={ReactLink} to={RoutesData.Home}>Home</Link>
              {/* <Link as={ReactLink} to={RoutesData.Construct}>Composable Demo</Link> */}
              {/* {account && account.length > 5 ? <Link as={ReactLink} to={RoutesData.Address}>Address</Link> : null} */}
              {/* {account && account.length > 5 ? <Link as={ReactLink} to={RoutesData.Start}>Mint!</Link> : null} */}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              {account && account.length > 4 ? <Menu>
                <MenuButton size="lg"
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <HStack>
                    <Avatar name={account} src={`https://robohash.org/${account}.png?set=set1`} />
                    <Text>{displayName}</Text>
                  </HStack>
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <MenuItem onClick={tryDisconnect}>Disconnect</MenuItem>
                </MenuList>
              </Menu> : <Menu>
                <MenuButton size="lg" isDisabled={true}
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >Connect</MenuButton>
                <MenuList alignItems={'center'}>
                  <MenuGroup title='EVM'>
                    <MenuItem icon={<JoyIDIcon />} isDisabled={true} >JoyID</MenuItem>
                    <MenuItem icon={<MetaMaskIcon />} isDisabled={true}>MetaMask</MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>}
              {/* <ColorModeSwitcher /> */}
            </Stack>
          </Flex>
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <Link as={ReactLink} to={RoutesData.Home}>Home</Link>
              {/* {account && account.length > 5 ? <Link as={ReactLink} to={RoutesData.Address}>Address</Link> : null} */}
              {/* {account && account.length > 5 ? <Link as={ReactLink} to={RoutesData.Start}>Mint!</Link> : null} */}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <Modal isCentered isOpen={isOpenOverlay} onClose={onCloseOverlay}>
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
        <ModalContent>
          <ModalHeader>Loading</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Center>
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
              />
            </Center>
          </ModalBody>
          <ModalFooter>
            {/* <Button onClick={onClose}>Close</Button> */}
            <Text>Please wait...</Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};