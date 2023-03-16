import React, { useState, useContext } from "react";
import { doc, Timestamp, arrayUnion, updateDoc, serverTimestamp } from "firebase/firestore";
import { OutlinedInput, FormControl } from "@mui/material";
import Button from '@mui/material/Button';
import "./MessageInput.css";
import { db } from "../../firebase/firebase";
import { AuthContext } from "../../context/AuthContext";
import { UserContext } from "../../context/UserContext";
import { v4 as uuid } from "uuid";

const MessageInput = () => {
    const [text, setText] = useState("");
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(UserContext);

    const handleSend = async () => {
        await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
                id: uuid(),
                text: text,
                senderId: currentUser.uid,
                date: Timestamp.now()
            })
        })

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text: text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });
      
        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text: text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });
      
        setText("");
    }

    return(
        <div id="message-input">
            <FormControl sx={{ width: "90%" }}>
                <OutlinedInput sx={{borderRadius: "0"}} id="message-field" placeholder="Enter your message..." value={text} onChange={({target})=>setText(target.value)} />
            </FormControl>
            <div id="send-btn">
                <Button fullWidth variant="contained" onClick={handleSend}
                sx={{
                    cursor: "pointer",
                    height: "-webkit-fill-available",
                    borderRadius: "0",
                    paddingLeft: "45px",
                    paddingRight: "45px"
                }}>
                Send
                </Button>
            </div>
        </div>
        
    );
};

export default MessageInput;