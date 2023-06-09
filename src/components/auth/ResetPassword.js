import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button, Text, Container, Box } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

const Login = () => {
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const history=useHistory()
  const { user } = ChatState()
  

  const toast = useToast();


  const handleClickPShow=()=>{
    setPasswordShow(!passwordShow);
    

  }
  const handleClickCShow=()=>{
    setConfirmPasswordShow(!confirmPasswordShow);
    

  }

  const submitHandler = async () => {
    if (!newPassword || !confirmPassword) {
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
      const email=user.user.email
      console.log(email);
      const { data } = await axios.post(
        "http://localhost:5000/api/user/reset-password",
        { email, newPassword, confirmPassword },
        config
      );

      if (data.success === true) {
        
        history.push("/auth")
        toast({
          title: "Pleasae Login!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.removeItem("userInfo");
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
    <Container maxW="xl" centerContent>
      <Box
        style={{ borderRadius: "15px" }}
        bg="white"
        m="100px 0 5px 0"
        w="70%"
        p={3}
        borderWidth="1px"
        color="black"
      >
        <VStack spacing="5px">
          <FormControl id="email" isRequired>
            <FormLabel>New Password</FormLabel>
            <InputGroup>

            <Input
              h="2.5rem"
              type={passwordShow ? "text" : "password"}
              value={newPassword}
              placeholder="Enter Your New Password"
              
              onChange={(e) => setNewPassword(e.target.value)}
              
            />
                  <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClickPShow}>
              {passwordShow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>

            <Input
              h="2.5rem"
              type={confirmPasswordShow ? "text" : "password"}

              value={confirmPassword}
              placeholder="Enter Your Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
                <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClickCShow}>
              {confirmPasswordShow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            colorScheme="teal"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
          >
            Next
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
