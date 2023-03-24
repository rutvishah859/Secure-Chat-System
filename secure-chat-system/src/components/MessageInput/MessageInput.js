import React, { useState, useContext } from "react";
import { doc, Timestamp, arrayUnion, updateDoc, serverTimestamp } from "firebase/firestore";
import { OutlinedInput, FormControl } from "@mui/material";
import Button from '@mui/material/Button';
import "./MessageInput.css";
import { db } from "../../firebase/firebase";
import { AuthContext } from "../../context/AuthContext";
import { UserContext } from "../../context/UserContext";
import { v4 as uuid } from "uuid";
import forge from 'node-forge';
import { getDoc } from "firebase/firestore";

const MessageInput = () => {
    const [text, setText] = useState("");
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(UserContext);

    const encryptMessage = (message, publicKeyPem) => {
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const messageBytes = forge.util.encodeUtf8(message);
        const encrypted = publicKey.encrypt(messageBytes, 'RSA-OAEP');
      
        return forge.util.encode64(encrypted);
      };

    const getPublicKey = async (userId) => {
        const publicKeyDoc = await getDoc(doc(db, "pubKeys", userId));
        const publicKeyData = publicKeyDoc.data();
        console.log(publicKeyDoc);
        if (publicKeyData && publicKeyData.pubKey) {
            return publicKeyData.pubKey;
        } else {
            return null;
        }
    };

    const handleSend = async () => {
        const pubKey = await getPublicKey(currentUser.uid);
        console.log(currentUser.uid);
        const encrypMessage = await encryptMessage(text, pubKey);
        
        console.log(data.chatId)
        await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
                id: uuid(),
                text: encrypMessage,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                encrypted: true,
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