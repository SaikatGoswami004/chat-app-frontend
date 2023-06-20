import React, { useEffect, useState,useRef } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModel from "./mislleneous/ProfileModel";
import UpdateGroupChatModal from "./mislleneous/UpdateGroupChatModal";
import axios from "axios";
import "./style.css";
import ScrolableChat from "./ScrolableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const messageEndRef = useRef(null);

  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotificastions,
  } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState();
  const [socketConn, setSocketConn] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMassages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured !",
        description: "Failed to load message",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessages) {
      socket.emit("stop typing", selectedChat._id);

      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessages("");
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessages,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConn(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    fetchMassages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);
  // console.log(notifications,"..........")
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          setNotificastions([newMessageRecieved, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
messageEndRef.current?.scrollIntoView();


  }, [ messages])

  const typingHandler = (e) => {
    setNewMessages(e.target.value);

    if (!socketConn) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const sendBtn=async()=>{
    if (newMessages) {
      socket.emit("stop typing", selectedChat._id);

      // socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessages("");
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessages,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMassages={fetchMassages}
                />
              </>
            )}
          </Text>
          <Box bg="#E8E8E8" h="75vh" borderRadius="md">
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            borderRadius="md"
            overflowY="scroll"
            h="68vh"
            sx={{
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={10}
                h={10}
                alignSelf="center"
                marigin="auto"
              />
            ) : (
              <div>
                
              <div className="messages" >
                <ScrolableChat  messages={messages} />
              </div>
              <div ref={messageEndRef}/>
              </div>
            )}
            {isTyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{ marginBottom: 0, marginLeft: 0 }}
                />
              </div>
            ) : (
              <></>
            )}
          </Box>
          <FormControl
            onKeyDown={sendMessage}
            isRequired
            mt={0}
            w="100%"
            h="7vh"
            style={{ display: "flex", margin:"0 0px 4px 11px "}}

          >
            <Input
              variant="filled"
              bg="white"
              placeholder="Type a message"
              onChange={typingHandler}
              value={newMessages}
              style={{ borderRadius: "15px" }}
            />
            <Button onClick={sendBtn} style={{ borderRadius: "15px" , margin:"0 21px 0px 5px "}} colorScheme='teal'>Send</Button>
          </FormControl>
          </Box>
        </>
      ) : (
        <Box
          d="flex"
          alignItem="center"
          justifyContent="center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a people to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
