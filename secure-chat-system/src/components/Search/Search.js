import React, { useState, useContext } from "react";
import TextField from '@mui/material/TextField';
import "./Search.css";
import { collection, query, where, setDoc, getDocs, getDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import firebase from 'firebase/app';
import { AuthContext } from "../../context/AuthContext";
import { Avatar } from "@mui/material";

const Search = () => {
    const [name, setName] = useState("");
    const [user, setUser] = useState({});
    const [err, setError] = useState(false);

    const { currentUser } = useContext(AuthContext);

    let firstname = `${currentUser.displayName.split(' ')[0]}`
    let lowername = name.toLowerCase()
    
    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where ("firstName", "==", name),
            where ("firstName", "!=", firstname),
        );

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                setUser(doc.data());
            });
            } catch(err) {
                console.log(err);
                setError(true);
        }  
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };

    // handle the selection of a user from search
    const handleUserSelect = async () => {
        if (!user || user.uid === currentUser.uid) {
            return;
        }
        
        let mergedIds = '';

        if (currentUser.uid > user.uid) {
            mergedIds = currentUser.uid + user.uid
        } else {
            mergedIds = user.uid + currentUser.uid;
        }

        try {
            const response = await getDoc(doc(db, "chats", mergedIds));
            
            if (!response.exists()) {
                await setDoc(doc(db, "chats", mergedIds), {messages: []});

                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [mergedIds + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName
                    },
                    [mergedIds + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [mergedIds + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName
                    },
                    [mergedIds + ".date"]: serverTimestamp(),
                });
            }
            return true;
        } catch(err){
            console.log(err);
            setError(true);
        }
        setUser(null);
        setName("");
    };

   
    function stringToColor(string) {
        let hash = 0;
        let i;
        
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
      
        return color;
    }

    function stringAvatar(name) {
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
    
    return(
        <div id="search">
            <TextField fullWidth id="standard-basic" label="Find a User" variant="standard" onKeyDown={handleKey} onChange={({target})=>setName(target.value)}/>
            {err && <span>No users found</span>}
            {user && (
                <div className="chat-details" onClick={handleUserSelect}>
                    <Avatar sx={{width: 24, height: 24}} {...stringAvatar(`${user?.firstName} ${user?.lastName}`)} className="vertical-align"/>
                    <span><b>{`${user?.firstName} ${user?.lastName}`}</b></span>
                </div>
            )}
        </div>
    );
};

export default Search;