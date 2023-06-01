import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button,Text ,Box,Container} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {useHistory} from "react-router-dom"

const Login = () => {
  
  const [email, setEmail] = useState();
  const history=useHistory()




  const submitHandler = async() => {
    history.push("/resetpassword")
   
      
    }
    

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
        <FormLabel>Email</FormLabel>
        <Input
          h="2.5rem"
          type={"email"}
          value={email}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
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
      
    </VStack>

  
      </Box>
  </Container>
  );
};

export default Login;
