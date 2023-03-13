import React from "react";
import "./SignupBody.css";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';

const SignupBody = () => {
    return(
        <form autoComplete="off" id="signup-body"> 
            <TextField
                required
                id="outlined"
                label="First Name"
                fullWidth={true}
            />
            <br/>
            <TextField
                required
                id="outlined"
                label="Last Name"
                fullWidth={true}
            />
            <br/>
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
                id="outlined"
                label="Username"
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
            <Button variant="contained" type="submit">Sign Up</Button>
        </form>
    );
};

export default SignupBody;