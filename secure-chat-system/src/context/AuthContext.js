import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = (({children}) => {
    const [user, setUser] = useState();

    useEffect(() => {
        onAuthStateChanged(auth, (usr) => {
            setUser(usr);
        });
    }, []);

    return (
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    );
});