import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Message.css";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import forge from "node-forge";
import * as CryptoJS from 'crypto-js';


const Message = ({time, message}) => {
    const { currentUser } = useContext(AuthContext);
    const [decryptedMessage, setDecryptedMessage] = useState("");
    const [owner, setOwner] = useState(false); 

    useEffect(() => {
        setOwner(message?.senderId === currentUser?.uid);
        const masterKey = localStorage.getItem('masterKey');
       
        const usersDoc = getDoc(doc(db, "users", currentUser.uid)).then((result) => {
            const encryptedPrivateKey = result.data().encryptedPrivateKey; 

            const privateKey = CryptoJS.AES.decrypt(encryptedPrivateKey, masterKey).toString(CryptoJS.enc.Utf8);

            const privKey = forge.pki.privateKeyFromPem(privateKey);
            
            try{
                const msg = owner ? message.senderText : message.receiverText;
                const encryptedBytes = forge.util.decode64(msg);
                const decryptBytes = privKey.decrypt(encryptedBytes, 'RSA-OAEP')
                const decryptedText = forge.util.decodeUtf8(decryptBytes);

                setDecryptedMessage(decryptedText);
            } catch(err)  {
                console.error(err);
            } 
        });
    }, [message, owner]);
    
    return(
        <div className={`message ${owner ? "owner" : ''}`}>
            <div className="messageInfo">
                <span>{time.toLocaleString()}</span>
            </div>
            <div className="messageContent">
                <p>{decryptedMessage}</p>
            </div>
        </div>
    );
};

export default Message;