import React, { useState } from "react";
import axios from 'axios';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase/firebase"
import { arrayUnion, doc, setDoc } from "firebase/firestore"; 
import "./SignupBody.css";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

const SignupBody = () => {
    const [formState, setFormState] = useState({});
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    // const functions = require('firebase-functions');

    //  Register the user on submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let email = formState?.email;
        let password = formState?.password;
        let ip = ''

        // get user IP
        await axios.get('https://geolocation-db.com/json/').then((res) => {
            ip = res.data.IPv4;
        }).then(async () => {
            await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
    
                await updateProfile(user, {
                    displayName: `${formState?.firstName} ${formState?.lastName}`
                });
    
                // create a user in the user doc
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    ips: arrayUnion(ip),
                    firstName: formState?.firstName.charAt(0).toUpperCase() + formState?.firstName.slice(1).toLowerCase(),
                    lastName: formState?.lastName.charAt(0).toUpperCase() + formState?.lastName.slice(1).toLowerCase(),
                    email: formState?.email
                });
    
                await setDoc(doc(db, "userChats", user.uid), {});
                navigate("/home");
            })
        }).catch((error) => {
            setError(true);
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    };

    return(
        <form autoComplete="off" id="signup-body" onSubmit={handleSubmit}> 
            <TextField
                required
                className="outlined"
                label="First Name"
                fullWidth
                onChange={({target}) => setFormState({...formState, firstName: target.value.charAt(0).toUpperCase() + target.value.slice(1).toLowerCase()})}
            />
            <br/>
            <TextField
                required
                className="outlined"
                label="Last Name"
                fullWidth
                onChange={({target}) => setFormState({...formState, lastName: target.value.charAt(0).toUpperCase() + target.value.slice(1).toLowerCase()})}
            />
            <br/>
            <TextField
                required
                className="outlined"
                label="Email"
                type="email"
                fullWidth
                onChange={({target}) => setFormState({...formState, email: target.value})}
            />
            <br/>
            <TextField
                required
                className="outlined-password-input"
                label="Password"
                type="password"
                fullWidth
                inputProps={{pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", min: 8}}
                onChange={({target}) => setFormState({...formState, password: target.value})}
            />
            <br/>
            {error && <span>An error has occured</span>}
            <Button variant="contained" type="submit">Sign Up</Button>
        </form>
    );
};

export default SignupBody;