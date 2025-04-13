import { createContext, useState, useEffect } from "react";
import userService from "../services/user.service";
import { useContext } from "react";
import { AuthContext } from "./auth.context"; 

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { user: authUser } = useContext(AuthContext);  
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (authUser) { 
            loadUser(authUser._id);
        }
    }, [authUser]);

    const loadUser = (id) => {
        userService.getOneUser(id)
            .then(({ data }) => setUser(data))
            .catch(err => console.log("Error loading user:", err));
    };

    return (
        <UserContext.Provider value={{ user, setUser, loadUser }}>
            {children}
        </UserContext.Provider>
    );
};
