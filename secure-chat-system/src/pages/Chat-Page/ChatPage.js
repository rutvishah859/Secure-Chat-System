import React from "react";
import ChatSection from "../../components/ChatSection/ChatSection";
import SideBar from "../../components/SideBar/SideBar";
import "./ChatPage.css";

const ChatPage = () => {
    return(
        <div id="chat-page">
            <SideBar />
            <ChatSection />
        </div>
    );
};

export default ChatPage;