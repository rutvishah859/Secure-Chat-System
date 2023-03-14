import React from "react";
import TextField from '@mui/material/TextField';
import "./Search.css";

const Search = () => {
    return(
        <div id="search">
            <TextField fullWidth id="standard-basic" label="Find a User" variant="standard" />
            {/* <div className="chat-details">
                <span>Rutvi Shah</span>
            </div> */}
        </div>
    );
};

export default Search;