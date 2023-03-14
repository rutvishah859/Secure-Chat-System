import React from "react";
import "./Message.css";

const Message = ({time, message, owner=false}) => {
    return(
        <div className={`message ${owner ? 'owner' : ''}`}>
            <div className="messageInfo">
                <span>{time.toLocaleString()}</span>
            </div>
            <div className="messageContent">
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Message;