import {
  ChakraProvider,
  Box,
  extendTheme,
} from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoutesData } from "./client/RoutesData";
import {HomeView} from "./pages/HomeView"

const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: '#4b5563',
        color: 'white',
      },
      // styles for the `a`
      a: {
        _hover: {
          textDecoration: 'none',
        },
      },
    },
  },
});

export const App = () => (
  <ChakraProvider theme={theme} >
    <Box padding={2} width="100%" mx="auto">
      <BrowserRouter>
        <Routes>
          {/* <Route path={RoutesData.SignMessage} element={<SignMessageView />} />
          <Route path={RoutesData.VerifyMessage} element={<VerifyMessageView />} /> */}
          <Route path="*" element={<HomeView />} />
        </Routes>
      </BrowserRouter>
    </Box>
  </ChakraProvider>
)
