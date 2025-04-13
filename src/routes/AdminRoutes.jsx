import { useContext } from "react"
import { Outlet, Navigate } from "react-router-dom"
import Loader from "../components/Loader/Loader"
import { UserContext } from "../contexts/user.context"

const AdminRoutes = () => {

    const { user, loadUser } = useContext(UserContext); 
    

    if (loadUser === null) {    
        return <Loader />
    }

    if (!user || user.role !== "ADMIN") {
        return <Navigate to="/" /> 
    }

    return <Outlet />
}

export default AdminRoutes
