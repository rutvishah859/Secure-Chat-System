import React, { useContext } from "react";
import "./ChatSection.css";
import Messages from "../Messages/Messages";
import MessageInput from "../MessageInput/MessageInput";
import { UserContext } from "../../context/UserContext";

const ChatSection = () => {
    const { data } = useContext(UserContext);

    return(
        <div id="chat-section">
            <div id="chat-navbar">
                <span id="vertical-align"><b>{data?.user?.displayName }</b></span>
            </div>
            <Messages />
            <MessageInput />
        </div>
    );
};

export default ChatSection;