import React, { useState } from "react";
import axios from 'axios';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app, auth, db } from "../../firebase/firebase"
import { arrayUnion, doc, setDoc } from "firebase/firestore"; 
import "./SignupBody.css";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import forge from "node-forge";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { scrypt } from 'scrypt-js';
const { v4: uuidv4 } = require('uuid');
import * as CryptoJS from 'crypto-js';


const generateRSAKeyPair = async() => {
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

    // Generate a master key from the password
    const generateMasterKey = async (password) => {
        const salt = uuidv4();
        const passwordBytes = new TextEncoder().encode(password);
        const saltBytes = new TextEncoder().encode(salt);
        const key = await scrypt(passwordBytes, saltBytes, 32768, 8, 1, 32); // Derive key from password and salt using scrypt
        const masterKey = Array.from(new Uint8Array(key)).map(b => b.toString(16).padStart(2, "0")).join(""); // Convert key to hex string for storage
        return { masterKey, salt };
    };

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

            const keyPair = await generateRSAKeyPair();

            // Generate a master key from the user's password
            const { masterKey, salt } = await generateMasterKey(password);

            await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
    
                await updateProfile(user, {
                    displayName: `${formState?.firstName} ${formState?.lastName}`
                });

                // Encrypt private key using master key
                const encryptedPrivateKey = CryptoJS.AES.encrypt(
                    keyPair.privateKey,
                    masterKey
                ).toString();

                
                // Create a user in the user doc
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    ips: arrayUnion(ip),
                    firstName: formState?.firstName.charAt(0).toUpperCase() + formState?.firstName.slice(1).toLowerCase(),
                    lastName: formState?.lastName.charAt(0).toUpperCase() + formState?.lastName.slice(1).toLowerCase(),
                    email: formState?.email,
                    salt: salt,
                    pubKey: keyPair.publicKey,
                    encryptedPrivateKey: encryptedPrivateKey,
                });

                await setDoc(doc(db, "userChats", user.uid), {});
    
                // Store master key in local storage
                localStorage.setItem('masterKey', masterKey);

                navigate("/home");
            })
        }).catch((error) => {
            setError(true);
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
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