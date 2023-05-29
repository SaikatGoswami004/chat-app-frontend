import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { ViewIcon } from "@chakra-ui/icons";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();
  const toast = useToast();

 
  const handleRemove = async(user1) => {
    if(selectedChat.groupAdmin._id!==user._id && user1._id !== user._Id){
        toast({
            title: "Only Admin can add someone",
            
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return ;
    }
    try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
    
        const { data } = await axios.put(
          `http://localhost:5000/api/chats/remove-from-group`,{
            chatId:selectedChat._id,
            userId:user1._id
          },
          config
        );
        console.log(data);
        user1._id===user._id?setSelectedChat():setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error occured !",
          description: "Failed to Add People",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
  };
   const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/chats/rename-group`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      // console.log(data);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured !",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

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
  const handleAddUser=async(user1)=>{
if(selectedChat.users.find(u=>u._id===user1._id)){
    toast({
        title: "User already in a group!",
        
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return ; 
}
if(selectedChat.groupAdmin._id!==user._id){
    toast({
        title: "Only Admin can add someone",
        
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return ;
}
try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.put(
      `http://localhost:5000/api/chats/add-to-group`,{
        chatId:selectedChat._id,
        userId:user1._id
      },
      config
    );
    
    console.log(user1._id);
    setSelectedChat(data)
    setFetchAgain(!fetchAgain)
    setLoading(false)
  } catch (error) {
    console.log(error);
    toast({
      title: "Error occured !",
      description: "Failed to Add People",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
    setLoading(false)
  }
  setGroupChatName("")
  }

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              {selectedChat?.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                colorScheme="teal"
                variant="solid"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading?(
                <Spinner size="lg"/>
            ):(
                searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              /> 
            ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
