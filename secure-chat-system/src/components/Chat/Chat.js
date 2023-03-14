import { Avatar } from "@mui/material";
import React, { useState } from "react";
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
    return(
        <div className="chat-details">
            <Avatar sx={{width: 24, height: 24}} {...stringAvatar(`${firstName} ${lastName}`)} className="vertical-align"/>
            <div>
                <span><b>{`${firstName} ${lastName}`}</b></span>
                <p>{latestMessage}</p>
            </div>
        </div>
    );
};

export default Chat;