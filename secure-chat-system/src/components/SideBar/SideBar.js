import Button from '@mui/material/Button';
import "./SideBar.css";
import NavBar from "../NavBar/NavBar";
import Search from "../Search/Search";
import Chat from "../Chat/Chat";
import { signOut } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { AuthContext } from "../../context/AuthContext";
import React, { useContext } from 'react';


const SideBar = () => {
    const {currentUser} = useContext(AuthContext);

    return(
        <div id="sidebar">
            <NavBar displayName={`${currentUser.displayName}`}/>
            <Search/>
            {/* TODO:map according to how many messages a particular user has */}
            <div id="chats">
                <Chat firstName="Rutvi" lastName="Shah" latestMessage="Sup bb"/>
            </div>

            <Button size="small" variant="contained" onClick={ ()=>signOut(auth) }
              sx={{
                cursor: "pointer", 
                fontSize: "10px", 
                minWidth: "45px", 
                minHeight: "30px",
                position: "absolute",
                bottom: "20px",
                margin: "0 20px"
              }}>
              Sign Out
            </Button>
        </div>
    );
};

export default SideBar;