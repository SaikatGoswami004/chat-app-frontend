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
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogic";
import NotificationBadge from "react-notification-badge";
import Effect from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotificastions,
  } = ChatState();
  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/auth");
  };
  const handleSearch = async () => {
    if (!search) {
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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured !",
        description: "Failed to load search result",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/chats`,
        { userId },
        config
      );
      if (!chats.find((ch) => ch._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fatching the Chat !",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
      style={{display:"flex",justifyContent:"space-between"}}
        
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User of chat" hasArrow placement="bottom-end">
          <Button variant="gost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search People
            </Text>
          </Button>
        </Tooltip>
        <Text style={{margin:"0 0 0 28rem"}}>Chat App</Text>
        <Menu >
          <MenuButton p={1}  style={{margin:"0 0 0 28rem"}}>
            <NotificationBadge
              count={notifications.length}
              effect={Effect.SCALE}
            />
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList p={2}>
            {!notifications.length && "No New Messages"}
            {notifications.map((notify) => (
              <MenuItem
                key={notify._id}
                onClick={() => {
                  setSelectedChat(notify.chat);
                  setNotificastions(notifications.filter((n) => n !== notify));
                }}
              >
                {notify.chat.isGroupChat
                  ? `New Message From ${notify.chat.chatName}`
                  : `New Message From ${getSender(user, notify.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
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
          <DrawerHeader borderBottomWidth="1px"> Search People</DrawerHeader>

          <DrawerBody>
            <Box style={{display:"flex"}} pb={2}>
              <Input
                placeholder="Search People.."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChats && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
