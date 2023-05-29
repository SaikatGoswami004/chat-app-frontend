import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Input,
  Spinner,
  
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios"
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState();
  const history = useHistory();
  const { isOpen, onOpen, onClose, } = useDisclosure();
  const toast = useToast();

  const { user,setSelectedChat ,chats,setChats} = ChatState();
  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const handleSearch=async()=>{
    if(!search){
        toast({
            title: "Please Enter Something!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
    }
    try {
        setLoading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        }

        const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,config);
        setLoading(false);
        setSearchResult(data)
    } catch (error) {
        console.log(error);
        toast({
            title: "Error occured !",
            description:"Failed to load search result",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
    }
  }
  const accessChat=async(userId)=>{
    try {
      setLoading(true);
      const config={
        headers:{
          "Content-type":"application/json",
            Authorization:`Bearer ${user.token}`,
        },
    }

    const {data}=await axios.post(`http://localhost:5000/api/chats`,{userId},config);
    if(!chats.find((ch)=>ch._id===data._id))   setChats([data,...chats])
    setSelectedChat(data);
    setLoading(false);
    onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fatching the Chat !",
        description:error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  return (
    <>
      <Box
        className="flexbox"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User o chat" hasArrow placement="bottom-end">
          <Button variant="gost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              search User
            </Text>
          </Button>
        </Tooltip>
        <Text>Chat App</Text>
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          {/* <MenuList>
              <MenuItem>Download</MenuItem>
              
            </MenuList> */}
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.image}
            />
          </MenuButton>
          <MenuList>
            <ProfileModel user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModel>
            <MenuItem onClick={logOutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search People.."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading?
            (<ChatLoading/>):(
                searchResult?.map((user)=>(
                    <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={()=>accessChat(user._id)}
                    />
                ))
            )
            }
            {loadingChats&&<Spinner ml="auto" d="flex"/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
