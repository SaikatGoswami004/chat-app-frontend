import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/mislleneous/SideDrawer";
import MyChats from "../components/mislleneous/MyChats";
import ChatBody from "../components/mislleneous/ChatBody";
import "./Chats.css"

const Chats = () => {
  const { user } = ChatState();
// console.log(user);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box className="flexbox" w="100%" h="91.5vh" p="10px" >
        {user && <MyChats />}
        {user && <ChatBody />}
      </Box>
    </div>
  );
};

export default Chats;
