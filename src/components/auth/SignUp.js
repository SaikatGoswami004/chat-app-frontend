import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {useHistory} from "react-router-dom"

const SignUp = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [conPasswordShow, setConPasswordShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history=useHistory()

  const passShow = () => {
    setPasswordShow(!passwordShow);
  };
  const confirmPassShow = () => {
    setConPasswordShow(!conPasswordShow);
  };
  const postDetails = (img) => {
    setLoading(true);
    if (img === undefined) {
      toast({
        title: "Please Select Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (img.type === "image/jpeg" || img.type === "image/png") {
      const data = new FormData();
      data.append("file", img);
      data.append("upload_preset", "ml_default");
      data.append("cloud_name", "ddk6mvux7");
      fetch("http://res.cloudinary.com/ddk6mvux7/image/upload/", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(data.url, toString());
          console.log(data.url, toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const submitHandler = async() => {

    setLoading(true);
    if(!name|| !email||!password||!confirmPassword){
      toast({
        title: "Please fill All Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
      
    }
    if(password!==confirmPassword){
      toast({
        title: "Password does not match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      return;
      
    }
    setLoading(false)
    try {
      const config={
        header:{
          "Content-type":"application/json"
        },

      }
      const {data}=await axios.post("http://localhost:5000/api/user/registration",{name,email,password,image},config);
      toast({
        title: "Registration successfull!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);
      history.push("/chats")
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error!',
        description: error.response.data.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      setLoading(false)

    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          h="2.1rem"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          h="2.1rem"
          type={"email"}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="Password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={passwordShow ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            h="2.1rem"
          />
          <InputRightElement width="4.5rem" mt="-3px">
            <Button h="1.5rem" size="sm" onClick={passShow}>
              {passwordShow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="Confirm Password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            h="2.1rem"
            type={conPasswordShow ? "text" : "password"}
            placeholder="Enter Your Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem" mt="-3px">
            <Button h="1.5rem" size="sm" onClick={confirmPassShow}>
              {conPasswordShow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="image">
        <FormLabel>Upload Your Image</FormLabel>
        <Input
          h="2.1rem"
          type="file"
          //   p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
