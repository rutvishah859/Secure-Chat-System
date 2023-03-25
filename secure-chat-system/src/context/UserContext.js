import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext();

export const UserContextProvider = (({children}) => {
    const { currentUser } = useContext(AuthContext);

    const INITIAL_STATE = {
        chatId: "null",
        user: {},
      };
    
      const userReducer = (state, action) => {
        switch (action.type) {
          case "CHANGE_USER":
            return {
              user: action.payload,
              chatId:
                currentUser.uid > action.payload.uid
                  ? currentUser.uid + action.payload.uid
                  : action.payload.uid + currentUser.uid,
            };
            case "CLEAR_CHAT_HISTORY":
              return {
                ...INITIAL_STATE,
              };
          default:
            return state;
        }
      };
    
    const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);

    return (
        <UserContext.Provider value={{data: state, dispatch}}>
            {children}
        </UserContext.Provider>
    );
});