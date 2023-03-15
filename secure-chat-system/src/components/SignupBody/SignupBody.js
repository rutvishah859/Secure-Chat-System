import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase/firebase"
import { doc, setDoc } from "firebase/firestore"; 
import "./SignupBody.css";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

const SignupBody = () => {
    const [formState, setFormState] = useState({});
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    //  Register the user on submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let email = formState?.email;
        let password = formState?.password;
        
        await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: `${formState?.firstName} ${formState?.lastName}`
            })

            // create a user in the user doc
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                firstName: formState?.firstName,
                lastName: formState?.lastName,
                email: formState?.email
            });

            await setDoc(doc(db, "userChats", user.uid), {});
            navigate("/home");
        })
        .catch((error) => {
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
                onChange={({target}) => setFormState({...formState, firstName: target.value})}
            />
            <br/>
            <TextField
                required
                className="outlined"
                label="Last Name"
                fullWidth
                onChange={({target}) => setFormState({...formState, lastName: target.value})}
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