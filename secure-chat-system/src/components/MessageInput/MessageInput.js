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
        const publicKeyDoc = await getDoc(doc(db, "users", userId));
        const publicKeyData = publicKeyDoc.data();
        
        if (publicKeyData && publicKeyData.pubKey) {
            return publicKeyData.pubKey;
        } else {
            return null;
        }
    };

    const handleSend = async () => {
        try {
            // encrypt for the sender (current user)
            const senderPubKey = await getPublicKey(currentUser.uid);
            const senderEncryptMsg = await encryptMessage(text, senderPubKey);
            
            // encrypt for the receiver
            const receiverPubKey = await getPublicKey(data.user.uid);
            const receiverEncryptMsg = await encryptMessage(text, receiverPubKey);
            
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    date: Timestamp.now(),
                    encrypted: true,
                    senderId: currentUser.uid,
                    senderText: senderEncryptMsg,
                    receiverId: data.user.uid,
                    receiverText: receiverEncryptMsg,
                }),
            });

            // await updateDoc(doc(db, "userChats", currentUser.uid), {
            //     [data.chatId + ".lastMessage"]: {
            //         senderText: text,
            //     },
            //     [data.chatId + ".date"]: serverTimestamp(),
            // });
        
            // await updateDoc(doc(db, "userChats", data.user.uid), {
            //     [data.chatId + ".lastMessage"]: {
            //         text: text,
            //     },
            //     [data.chatId + ".date"]: serverTimestamp(),
            // });
        
            setText("");
        } catch(e) {
            console.error(e);
        }
    }

    return(
        <div id="message-input">
            <FormControl sx={{ width: "90%" }}>
                <OutlinedInput 
                    sx={{borderRadius: "0"}} 
                    id="message-field" 
                    placeholder="Enter your message..." 
                    value={text} 
                    onChange={({target})=>setText(target.value)} 
                    onKeyDown={(event) => {
                        if (event.keyCode === 13) {
                            handleSend();
                        }
                    }}
                    disabled={data.chatId === "null" || data.chatId === ""}
                />
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