import { useState, useEffect, useContext } from "react"
import { Form, Button } from "react-bootstrap"
import userService from "../../services/user.service"
import { useParams } from "react-router-dom"
import { UserContext } from "../../contexts/user.context"   

const EditUserForm = ({ closeModal, updateList }) => {

    const { user, setUser } = useContext(UserContext);
    const [userData, setUserData] = useState({
        username: '',
        email: ''
    })

    const { _id } = useParams()

    useEffect(() => {
        loadUser()
    }, [])

    const loadUser = () => {

        userService
            .getOneUser(_id)
            .then(({ data }) => {
                setUserData(data)
            })
            .catch(err => console.log(err))
    }

    const handleInputChange = event => {
        const { name, value } = event.target
        setUserData({ ...userData, [name]: value })
    }

    const handleSubmit = event => {
        event.preventDefault()

        userService
            .editUser(_id, userData)
            .then(() => {
                setUser(userData)
                closeModal()
                updateList()
            })
            .catch(err => console.log(err))
    }

    const { username, email } = userData

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label>UserName</Form.Label>
                <Form.Control type="text" value={username} onChange={handleInputChange} name="username" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
                <Form.Label>@Email</Form.Label>
                <Form.Control type="text" value={email} onChange={handleInputChange} name="email" />
            </Form.Group>

            <div className="d-grid">
                <Button variant="dark" type="submit" >Update</Button>
            </div>
        </Form>
    )
}

export default EditUserForm