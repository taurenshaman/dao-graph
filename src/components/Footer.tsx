import { Box, Spacer, Link, HStack, Divider, Text } from "@chakra-ui/react";

export const Footer = ()=>{
    return (
        <Box w="100%" h={12}>
            <Divider mt={3} mb={3} colorScheme="gray"/>
            <HStack spacing={3} ml={3}>
                <Text>Contributed by Devil</Text>
                <Link href="https://daosquare.io/">@DAOSquare</Link>
                <Link href="https://twitter.com/DAOSquare">Twitter</Link>
                <Link href="https://discord.com/invite/daosquare">Discord</Link>
                <Link href="https://github.com/taurenshaman/dao-graph">Github</Link>
                {/* <Spacer/>
                <Text color='gray'>Hello Web3!</Text> */}
            </HStack>
        </Box>
    );
}