import React, { useState } from 'react';
import { Link as ReactLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Link, Container, useDisclosure, Stack, HStack, IconButton, Menu, MenuButton, Button, MenuList, MenuItem, Spinner, Text, useToast, Avatar, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, MenuGroup, MenuDivider, Icon, Tag, TagLabel, } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Logo } from '../icons/Logo';
import { RoutesData } from '../client/RoutesData';
import { FaCross, FaDiscord, FaDiscourse, FaGithub, FaHamburger, FaHammer, FaLink, FaTwitter } from 'react-icons/fa';
import { ViewData } from '../client/ViewData';
import { ViewModelBridge } from '../client/ViewModelBridge';
import { JoyIDIcon, MetaMaskIcon } from '../icons/Icons';
import { PlatformDataType, PlatformsData } from '../platforms/PlatformsData';
import { EthWallet } from '../accounts/EthWallet';
// import { EthWallet } from '../accounts/EthWallet';
// import { JoyIDEvmWallet } from '../accounts/JoyIDEvmWallet';
// import { Wallet } from '../accounts/Wallet';
// import { DotbitContext } from '../chains/DotbitContext';

export type NavBarType = {
  //onPlatformChanged: (newPlatform: PlatformDataType) => void;
  platformData: PlatformDataType;
}

export const NavBar = ({platformData}: NavBarType ) => {
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
  
  const connectEth = async () => {
    const wallet = new EthWallet();
    const addr = await wallet.connect();
    ViewData.ethAddress = wallet.account;
    //afterConnected(wallet, addr);
    await getDIDs();

    //nav(RoutesData.Start);
  }

  const tryDisconnect = async () => {
    setAccount("");
    ViewData.wallet = null;
    ViewData.ethAddress = "";
    ViewData.connected = false;

    if (ViewModelBridge.afterDisConnected)
      ViewModelBridge.afterDisConnected();

    nav(RoutesData.Home);
  }

  const drawPlatformLinks = (direction: "column" | "row", display: any = {}) => {
    return (
      <Stack direction={direction} as={'nav'} spacing={4} fontSize="24px" display={display} alignItems="center">
        <Link target="_blank" href={platformData.website}><FaLink/></Link>
        <Link target="_blank" href={platformData.twitter}><FaTwitter/></Link>
        <Link target="_blank" href={platformData.discord}><FaDiscord/></Link>
        {platformData.forum.length > 4 ? <Link target="_blank" href={platformData.forum}><FaDiscourse/></Link> : null}
        <Link target="_blank" href={platformData.github}><FaGithub/></Link>
        {platformData.gov.length > 4 ? <Link target="_blank" href={platformData.gov}><FaHammer/></Link> : null}
        <Tag size="sm" bg="#a5b4f4" color="#4b5563" title='Version'>
            <TagLabel>{`v${platformData.version}`}</TagLabel>
        </Tag>
      </Stack>
    );
  }
  //const normalDisplay = { base: 'none', md: 'flex' };

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
            <Logo boxSize={12} title="DAO Graph" />
            {drawPlatformLinks("row", { base: 'none', md: 'flex' })}
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
            {drawPlatformLinks("column", {})}
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