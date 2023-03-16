import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import "./Message.css";

const Message = ({time, message, owner=false}) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(UserContext);
    
    return(
        <div className={`message ${message?.senderId === currentUser?.uid ? "owner" : ''}`}>
            <div className="messageInfo">
                <span>{time.toLocaleString()}</span>
            </div>
            <div className="messageContent">
                <p>{message.text}</p>
            </div>
        </div>
    );
};

export default Message;