import { createContext, useEffect, useState } from "react"
import authService from "./../services/auth.service"
import Loader from "../components/Loader/Loader"
import { useNavigate } from "react-router-dom";

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
                    console.log("✅ Usuario autenticado", data)
                    setUser(data)
                    setIsLoading(false)
                    const navigate = useNavigate();
                    navigate('/products/list');
                })
                .catch(err => {
                    console.error("❌ Error verificando token", err)

                    if (err.response?.status === 401 || err.response?.data?.code === 'invalid_token') {
                        console.log("🔐 Token inválido o expirado, cerrando sesión...")
                        logout()
                    } else {
                        setIsLoading(false)
                    }
                })
        } else {
            console.log("⚠️ No hay token")
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