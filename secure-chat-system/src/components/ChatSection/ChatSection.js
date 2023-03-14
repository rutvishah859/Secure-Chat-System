import React from "react";
import "./ChatSection.css";
import Messages from "../Messages/Messages";
import MessageInput from "../MessageInput/MessageInput";

const ChatSection = ({firstName, lastName}) => {
    return(
        <div id="chat-section">
            <div id="chat-navbar">
                <span id="vertical-align"><b>{`${firstName} ${lastName}`}</b></span>
            </div>
            <Messages />
            <MessageInput />
        </div>
    );
};

export default ChatSection;