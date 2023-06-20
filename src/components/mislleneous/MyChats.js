import React, { useEffect, useState } from "react";
import { Box, Button, Stack, useToast, Text } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogic";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  // const history = useHistory();
  // const { isOpen, onOpen, onClose, } = useDisclosure();
  const toast = useToast();

  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/chats`,
        config
      );

      setChats(data);
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
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChat();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none " : "flex", md: "flex" }}
      flexDir="column"
      allignitems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "flex" }}
      borderRadius="lg"
      borderWidth="1px"
      style={{ width: "25rem" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "22px", md: "22px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "14px", md: "10px", lg: "14px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        style={{ display: "flex" }}
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        borderRadius="lg"
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
        h="75vh"
      >
        {chats ? (
          <Stack
            overflowY="scroll"
            sx={{
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {/* {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )} */}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
