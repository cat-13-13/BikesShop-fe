import { useContext } from 'react'
import { AuthContext } from '../contexts/auth.context' 
import { Routes, Route } from 'react-router-dom'

import Loader from '../components/Loader/Loader' 
import HomePage from "./../pages/HomePage/HomePage"
import SignUpPage from "./../pages/SignUpPage/SignUpPage"
import LogInPage from "../pages/LogInPage/LogInPage"
import ProductsListPage from "../pages/ProductsListPage/ProductsListPage"
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage'
import UsersListPage from '../pages/UsersListPage/UsersListPage'
import UserDetailPage from '../pages/UserDetailPage/UserDetailPage'
import PurchasePage from '../pages/PurchasePage/PurchasePage'
import CartPage from '../pages/CartPage/CartPage'

import PrivateRoutes from './PrivateRoutes'
import AdminRoutes from './AdminRoutes'


const AppRoutes = () => {

    const { isLoading } = useContext(AuthContext)

    if (isLoading) {
        return <Loader />
    }

    return (

        <Routes>
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/login" element={<LogInPage />} />

            <Route element={<PrivateRoutes />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/users/:_id" element={<UserDetailPage />} />
                <Route path="/products/list" element={<ProductsListPage />} />
                <Route path="/products/:_id" element={<ProductDetailPage />} />
                <Route path="/products/:product_id/purchase" element={<PurchasePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/purchase" element={<PurchasePage />} />
            </Route>

            <Route element={<AdminRoutes />}>
                <Route path="/users/list" element={<UsersListPage />} />
            </Route>

            <Route path="*" element={<h1>404</h1>} />
        </Routes>
    )
}

export default AppRoutes