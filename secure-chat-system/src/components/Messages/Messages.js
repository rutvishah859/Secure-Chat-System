import React from "react";
import Message from "../Message/Message";
import "./Messages.css";

const Messages = () => {
    return(
        <div id="messages">
            <Message time={new Date()} message="The max-height CSS property sets the maximum height of an element. It prevents the used value of the height property from becoming larger ..." owner={true}/>
            <Message time={new Date()} message="The max-height CSS property sets the maximum height of an element. It prevents the used value of the height property from becoming larger ..." />
        </div>
    );
};

export default Messages;