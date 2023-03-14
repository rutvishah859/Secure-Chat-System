import React from "react";
import { OutlinedInput, FormControl } from "@mui/material";
import Button from '@mui/material/Button';
import "./MessageInput.css";

const MessageInput = () => {
    return(
        <div id="message-input">
            <FormControl sx={{ width: "90%" }}>
                <OutlinedInput sx={{borderRadius: "0"}} id="message-field" placeholder="Enter your message..." />
            </FormControl>
            <div id="send-btn">
                <Button fullWidth variant="contained" 
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