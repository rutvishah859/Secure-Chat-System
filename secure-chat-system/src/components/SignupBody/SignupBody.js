import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app, auth, db } from "../../firebase/firebase"
import { doc, setDoc } from "firebase/firestore"; 
import "./SignupBody.css";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import forge from "node-forge";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


export const generateRSAKeyPair = async() => {
    return new Promise((resolve, reject) => {
        forge.pki.rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
                    privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
                });
            }
        });
    });
}

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
            });

            // create a user in the user doc
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                firstName: formState?.firstName.charAt(0).toUpperCase() + formState?.firstName.slice(1).toLowerCase(),
                lastName: formState?.lastName.charAt(0).toUpperCase() + formState?.lastName.slice(1).toLowerCase(),
                email: formState?.email
            });

            const keyPair = await generateRSAKeyPair();

            localStorage.setItem(`privKey-${currentUser.uid}`, keyPair.privateKey);

            await setDoc(doc(db, "pubKeys", user.uid), {
                pubKey: keyPair.publicKey
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