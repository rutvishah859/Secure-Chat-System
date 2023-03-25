import Button from '@mui/material/Button';
import "./SideBar.css";
import NavBar from "../NavBar/NavBar";
import Search from "../Search/Search";
import Chat from "../Chat/Chat";
import { signOut } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { UserContext } from '../../context/UserContext';
import { AuthContext } from "../../context/AuthContext";
import React, { useContext } from 'react';


const SideBar = () => {
    const {currentUser} = useContext(AuthContext);
    const { dispatch } = useContext(UserContext);

    return(
        <div id="sidebar">
            <NavBar displayName={`${currentUser.displayName}`}/>
            <Search/>

            <div id="chats">
                <Chat />
            </div>

            <Button size="small" variant="contained" onClick={ () => signOut(auth, localStorage.clear(), dispatch({type: "CLEAR_CHAT_HISTORY"}))}
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