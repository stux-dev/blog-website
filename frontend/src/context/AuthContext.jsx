import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(()=> {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
        if (storedToken && storedUser) {
            // If a token exists, configure the API client with it
             
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (token, user) => {
        setToken(token);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", token);

  
    }


    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");


    }


    return(
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
 

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);