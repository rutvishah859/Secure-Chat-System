import { Avatar } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Chat.css";

function stringToColor(string) {
    let hash = 0;
    let i;
    
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    return color;
}

function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const Chat = ({firstName, lastName, latestMessage}) => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    if (currentUser.uid) {
      getChats();
    }
  }, [currentUser.uid]);
  
  console.log(Object.entries(chats));
  
  return(
    <div className="userChats">
      {Object.entries(chats)?.map((chat) => (
        <div className="chat-details" key={chat[0]}>
          <Avatar sx={{width: 24, height: 24}} {...stringAvatar(`${chat[1].userInfo.displayName}`)} className="vertical-align"/>
          <span><b>{chat[1].userInfo.displayName}</b></span>
          <p>{chat[1].userInfo.latestMessage?.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Chat;