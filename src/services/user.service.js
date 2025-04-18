import axios from 'axios'

class UserService {

    constructor() {
        this.api = axios.create({
            baseURL: `${process.env.REACT_APP_API_URL}/api/users`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");

            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }

            return config
        })
    }


    getAllUsers() {
        return this.api.get('/getAllUsers')
    }

    getOneUser(user_id) {
        return this.api.get(`/getOneUser/${user_id}`)
    }


    addToCart(user_id, product_id, options, price, title) {
        return this.api.post(`/cart/${user_id}/${product_id}`, {options: options, price: price, title: title})
    }


    editCartItem(user_id, cart_item_id, quantity) {
        return this.api.put(`/cart/${user_id}/${cart_item_id}`, {quantity})
    }

    editUser(user_id, userData) {
        return this.api.put(`/editUser/${user_id}`, userData)
    }

    buyProduct(user_id, shipmentAddress, creditCard) {
        return this.api.post(`/buyProducts/${user_id}`, {shipmentAddress: shipmentAddress, purchaseMethod: creditCard})
    }


    removeFromCart(user_id, cart_item_id) {
        return this.api.delete(`/cart/${user_id}/${cart_item_id}`)
    }

    deleteUser(user_id) {
        return this.api.delete(`/deleteUser/${user_id}`)
    }

}

const userService = new UserService()

export default userService