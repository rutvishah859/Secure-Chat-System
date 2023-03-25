import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./SigninBody.css";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import {signInWithEmailAndPassword} from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import { auth, db } from "../../firebase/firebase";
import { getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import SignupBody, { getGenerateMasterKey } from "../SignupBody/SignupBody";
import axios from "axios";
import emailjs from '@emailjs/browser';
import { scrypt } from 'scrypt-js';

const SigninBody = () => {
    const [formState, setFormState] = useState({});
    const [uid, setUid] = useState('');
    const [currentIP, setCurrentIP] = useState('');
    const [error, setError] = useState(false);
    const [twoWayAuth, setTwoWayAuth] = useState(false);
    const [twoWayAuthCode, setTwoWayAuthCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    // const getSalt = async (userId) => {
    //     const salt = await getDoc(doc(db, "users", userId));
    //     const saltData = saltData.data();
        
    //     if (publicKeyData && publicKeyData.salt) {
    //         return publicKeyData.pubKey;
    //     } else {
    //         return null;
    //     }
    // };

    // Generate a master key from the password
    const generateMasterKey = async (password, userID) => {
        const salt = await getDoc(doc(db, "users", userID));
        const saltData = salt.data()?.salt;

        //const salt = uuidv4();
        const passwordBytes = new TextEncoder().encode(password);
        const saltBytes = new TextEncoder().encode(saltData);
        const key = await scrypt(passwordBytes, saltBytes, 32768, 8, 1, 32); // Derive key from password and salt using scrypt
        const masterKey = Array.from(new Uint8Array(key)).map(b => b.toString(16).padStart(2, "0")).join(""); // Convert key to hex string for storage
        
        return { masterKey };
    };

    //  Register the user on submit
    const handleSubmit = async (e) => {        
        e.preventDefault();
        
        let email = formState?.email;
        let password = formState?.password;

        signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
            const userID = userCredential.user.uid;
            setUid(userID);
        
            // check IP address
            const docRef = doc(db, 'users', userID);
            const docSnap = await getDoc(docRef);
            const ips = docSnap.data()?.ips;
            await axios.get('https://geolocation-db.com/json/').then((res) => {
                const currIP = res.data.IPv4
                setCurrentIP(currIP);

                let sendEmail = true;
                ips.forEach(ip => {
                    if (ip == currIP){
                        navigate("/home");
                        sendEmail = false;
                    }
                });
                
                if(sendEmail){
                    // if the user IP is not already logged verify their identity
                    setTwoWayAuth(true);
                    // generate the 2-way auth code
                    const code = (Math.random() + 1).toString(36).substring(6);
                    setGeneratedCode(code);

                    // send the email with the 2-way auth code
                    const templateParams = {
                        user_email: email,
                        to_name: '',
                        ver_code: code,
                    };
                    // send the email
                    emailjs.send(process.env.REACT_APP_EMAIL_SERVICE_ID, process.env.REACT_APP_EMAIL_TEMPLATE_ID, templateParams, process.env.REACT_APP_EMAIL_PUBLIC_KEY).then((result) => {
                        console.log(result.text);
                    }, (error) => {
                        alert('Unable to Send the Email');
                        console.log(error.text);
                    });
                }
            });

            const { masterKey } = await generateMasterKey(password, userID);
            localStorage.setItem('masterKey', masterKey);

        }).catch((error) => {
            setError(true);
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
    };

    const verifyCode = async () => {
        if (generatedCode == twoWayAuthCode) {
            // add IP address to DB
            await updateDoc(doc(db, "users", uid), {
                ips: arrayUnion(currentIP),
            });
            navigate("/home");
        }
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
            {error ? <span>An error has occured</span> : ''}
            {twoWayAuth && 
                <TextField
                    required
                    id="outlined-password-input"
                    label="2-Way Authentication Code"
                    type="password"
                    fullWidth={true}
                    onChange={({target}) => setTwoWayAuthCode(target.value)}
            />
            }
            <br/>
            {twoWayAuth ? 
                <Button variant="contained" type="button" onClick={verifyCode}>Verify</Button>
                :
                <Button variant="contained" type="submit">Sign In</Button>
            }
        </form>
    );
};

export default SigninBody;