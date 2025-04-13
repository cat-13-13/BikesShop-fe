import { createContext, useEffect, useState } from "react"
import authService from "./../services/auth.service"
import Loader from "../components/Loader/Loader"

const AuthContext = createContext()

function AuthProviderWrapper(props) {

    const [user, setUser] = useState(null) 
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        authenticateUser()
    }, [])

    const storeToken = token => {
        localStorage.setItem('authToken', token)
    }

    const removeToken = () => {
        localStorage.removeItem('authToken')
    }

    const logout = () => {
        setUser(null)
        setIsLoading(false)
        removeToken()
    }

    const authenticateUser = () => {
        const token = localStorage.getItem("authToken")

        if (token) {
            authService
                .verify(token)
                .then(({ data }) => {
                    console.log(data)
                    setUser(data)
                    setIsLoading(false) 
                })
                .catch(err => {
                    logout() 
                })
        } else {
            logout()
        }
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <AuthContext.Provider value={{ user, authenticateUser, storeToken, logout, isLoading }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProviderWrapper }