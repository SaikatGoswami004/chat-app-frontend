import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender ,getSenderFull} from "../config/ChatLogic";
import ProfileModel from "./mislleneous/ProfileModel";
import UpdateGroupChatModal from "./mislleneous/UpdateGroupChatModal";
import axios from "axios";
import "./style.css"
import ScrolableChat from "./ScrolableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const [newMessages,setNewMessages]=useState();
  const toast = useToast();


const fetchMassages=async()=>{
  if(!selectedChat) return;

  try {
    const config={
      headers:{
        "Content-type":"application/json",
        Authorization:`Bearer ${user.token}`
      }
    }
    setLoading(true);
    
    const {data}=await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,config);
    setMessages(data);
    setLoading(false);
    
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
}
  const sendMessage=async(event)=>{
    if(event.key==="Enter" && newMessages){
      try {
        const config={
          headers:{
            "Content-type":"application/json",
            Authorization:`Bearer ${user.token}`
          }
        }
        setNewMessages("");
        const {data}=await axios.post("http://localhost:5000/api/message",{
          content:newMessages,
          chatId:selectedChat._id
        },config);
        console.log(data);
        setMessages([...messages,data]);
        

      } catch (error) {
        console.log(error);
        toast({
          title: "Error occured !",
          description: "Failed to send message",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
   
  }
  const typingHandler=(e)=>{
    setNewMessages(e.target.value)
  }
  

useEffect(()=>{
  fetchMassages();
},[selectedChat])


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
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {
                !selectedChat.isGroupChat?(
                <>
                    {getSender(user,selectedChat.users)}
                <ProfileModel user={getSenderFull(user,selectedChat.users)}/>
            </>
                ):(
                    <>
                        {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMassages={fetchMassages}


                    />
                    </>
                )
            }
          </Text>
          <Box
          d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading?(
              <Spinner
              size="xl"
              w={10}
              h={10}
              alignSelf="center"
              marigin="auto"

              />
            ):(
              <div className="messages">
              <ScrolableChat messages={messages}/>
             
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input 
                variant="filled"
                bg="#E0E0E0"
                placeholder="Type a message"
                onChange={typingHandler}
                value={newMessages}

              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItem="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a people to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
