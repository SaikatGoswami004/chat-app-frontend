import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
// import {FromControl} from "@chakra-ui/from-control"
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import "../../pages/Chats.css";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      // console.log(data);
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
  const handleSubmit = async () => {
    if(!groupChatName || !selectedUser){
      toast({
        title: "Please fill all the Fields",
        
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    try {
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/chats/group`,{
        name:groupChatName,
        users:JSON.stringify(selectedUser.map((u)=>u._id))
        },
        config
      );
      // console.log(data);
      
      setChats([data,...chats]);
      onClose();
      toast({
        title: "New group created",
        
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to created chat",
        description: "Failed to load search result",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };
  const handleDelete = (delUser) => {
    setSelectedUser(selectedUser.filter(sel=>sel._id!==delUser._id))
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            className="flexbox"
            fontSize="35px"
            fontFamily="Work sans"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">

            {selectedUser.map((users) => (
              <UserBadgeItem
                key={users._id}
                user={users}
                handleFunction={() => handleDelete(users)}
              /> 
            ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 5)
                .map((users) => (
                  <UserListItem
                    key={users._id}
                    user={users}
                    handleFunction={() => handleGroup(users)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
