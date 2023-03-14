import React from "react";
import "./SigninBody.css";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';


const SigninBody = () => {
    return(
        <form autoComplete="off" id="signin-body"> 
            <TextField
                required
                id="outlined"
                label="Email"
                type="email"
                fullWidth={true}
            />
            <br/>
            <TextField
                required
                id="outlined-password-input"
                label="Password"
                type="password"
                fullWidth={true}
            />
            <br/>
            <Button variant="contained" type="submit">Sign In</Button>
        </form>
    );
};

export default SigninBody;