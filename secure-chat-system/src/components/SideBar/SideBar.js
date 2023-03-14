import React from "react";
import Button from '@mui/material/Button';
import "./SideBar.css";
import NavBar from "../NavBar/NavBar";
import Search from "../Search/Search";
import Chat from "../Chat/Chat";

const SideBar = () => {
    return(
        <div id="sidebar">
            <NavBar firstName="Foram" lastName="Gandhi"/>
            <Search/>
            {/* TODO:map according to how many messages a particular user has */}
            <div id="chats">
                <Chat firstName="Rutvi" lastName="Shah" latestMessage="Sup bb"/>
            </div>

            <Button size="small" variant="contained" 
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