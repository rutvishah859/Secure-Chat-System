import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SigninBody.css";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import {signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "../../firebase/firebase";

const SigninBody = () => {
    const [formState, setFormState] = useState({});
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    //  Register the user on submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let email = formState?.email;
        let password = formState?.password;
        
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate("/home");
            })
            
            .catch((error) => {
                setError(true);
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    };
    
    return(
        <form autoComplete="off" id="signin-body" onSubmit={handleSubmit}> 
            <TextField
                required
                id="outlined"
                label="Email"
                type="email"
                fullWidth={true}
                onChange={({target}) => setFormState({...formState, email: target.value})}
            />
            <br/>
            <TextField
                required
                id="outlined-password-input"
                label="Password"
                type="password"
                fullWidth={true}
                onChange={({target}) => setFormState({...formState, password: target.value})}
            />
            <br/>
            {error && <span>An error has occured</span>}
            <Button variant="contained" type="submit">Sign In</Button>
        </form>
    );
};

export default SigninBody;