import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button, Text, Box, Container } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

const Login = () => {
  const { user } = ChatState();

  const [email, setEmail] = useState();
  const [otp, setOtp] = useState();
  const history = useHistory();
  const toast = useToast();

  const submitHandler = async () => {
    if (!email || !otp) {
      toast({
        title: "Please fill All Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        header: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user/forgot-password",
        { email, otp },
        config
      );

      if (data.success === true) {
        localStorage.setItem("userInfo", JSON.stringify(data));

        history.push("/resetpassword");
        toast({
          title: "Pleasae Enter New Passsworrd!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error!",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="xl" centerContent colorScheme="red">
      <Box
        style={{ borderRadius: "15px" }}
        bg="white"
        m="100px 0 5px 0"
        w="70%"
        p={3}
        borderWidth="1px"
        color="brown"
        colorScheme="red"
      >
        <VStack spacing="5px" colorScheme="red">
          <FormControl id="email" isRequired colorScheme="red">
            <FormLabel>Email</FormLabel>
            <Input
              h="2.5rem"
              type={"email"}
              value={email}
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="otp" isRequired colorScheme="red">
            <FormLabel>OTP</FormLabel>
            <Input
              h="2.5rem"
              type={"text"}
              value={otp}
              placeholder="Enter Your OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
          </FormControl>

          <Button
            colorScheme="teal"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
          >
            Next
          </Button>
          <Text colorScheme="red">OTP 12345 </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
