import { Container, Row, Col, Form, Button } from 'react-bootstrap'

import { useContext, useState } from "react"
import authService from './../../services/auth.service'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from "./../../contexts/auth.context"

const LoginPage = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const { authenticateUser, storeToken } = useContext(AuthContext)

    const handleInputChange = e => {
        const { value, name } = e.target
        setLoginData({ ...loginData, [name]: value })
    }

    const handleSubmit = e => {

        e.preventDefault()

        authService
            .login(loginData)
            .then(({ data }) => {
                storeToken(data.authToken)
                authenticateUser()
                navigate('/')
            })
            .catch(err => console.log(err))
    }


    const { password, email } = loginData

    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>

                    <h1>Log In</h1>
                    <hr />

                    <Form onSubmit={handleSubmit}>


                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>@EMAIL</Form.Label>
                            <Form.Control type="email" value={email} onChange={handleInputChange} name="email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>PASSWORD</Form.Label>
                            <Form.Control type="password" value={password} onChange={handleInputChange} name="password" />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="dark" type="submit">GO!</Button>
                        </div>

                    </Form>

                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage