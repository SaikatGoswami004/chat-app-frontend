import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/auth/Login";
import SignUp from "../components/auth/SignUp";
import { useHistory } from "react-router-dom";

const Auth = () => {
  const history = useHistory();
  useEffect(() => {
    const user=JSON.parse(localStorage.getItem("userInfo"))

    if(!user){
      history.push("/auth");
    }else{
      history.push("/");

    }

  }, [history])
  return (
    <Container maxW="xl" centerContent>
      {/* <Box
        d="flex"
        justifyContent="center"
        p={1}
        bg="white"
        w="100%"
        m="40px 0 5px 0"
        borderWidth="1px"
        h="3rem"
      >
        <Center fontSize="2xl" fontFamily="Work sans" color="Black">
          Chat App
        </Center>
        {/* <Text   color="Black"></Text> 
      </Box>*/}

      <Box
        style={{ borderRadius: "15px" }}
        bg="white"
        m="100px 0 5px 0"
        w="70%"
        p={3}
        borderWidth="1px"
        color="black"
      >
        <Tabs
          style={{ color: "#9B2C2C" }}
          variant="soft-rounded"
          colorScheme="red"
        >
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login></Login>
            </TabPanel>
            <TabPanel h="27rem">
              <SignUp></SignUp>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Auth;
