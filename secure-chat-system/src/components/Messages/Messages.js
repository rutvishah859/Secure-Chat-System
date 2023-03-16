import React, { useState, useContext, useEffect } from "react";
import { doc, onSnapshot, Timestamp } from "firebase/firestore"; 
import { db } from "../../firebase/firebase";
import { UserContext } from "../../context/UserContext";
import Message from "../Message/Message";
import "./Messages.css";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(UserContext);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data?.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
            unSub();
        }
    }, [data.chatId]);

    return(
        <div id="messages">
            {messages.map(msg => (
                <Message key={msg.id} time={(msg.date).toDate()} message={msg} owner={true} />
            ))}
        </div>
    );
};

export default Messages;