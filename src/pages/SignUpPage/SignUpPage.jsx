import { Container, Row, Col, Form, Button } from "react-bootstrap"

import { useState, useContext } from "react"
import authService from './../../services/auth.service'
import { useNavigate } from "react-router-dom"
import { UserContext } from '../../contexts/user.context'

const SignupPage = () => {

    const [signupData, setSignupData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate()
    const { setUser } = useContext(UserContext)

    const handleInputChange = e => {
        const { value, name } = e.target
        setSignupData({ ...signupData, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault()

        authService
            .signup(signupData)
            .then(({ data }) => {
                console.log(data)
                if (data.authToken) {
                    localStorage.setItem('authToken', data.authToken)
                    setUser(data.user)
                    navigate('/')
                }
            })
            .catch(err => console.log('Signup error:', err))
    }

    const { username, password, email } = signupData

    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>

                    <h1>Sign Up</h1>
                    <hr />

                     <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>USERNAME</Form.Label>
                            <Form.Control type="text" value={username} onChange={handleInputChange} name="username" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>@EMAIL</Form.Label>
                            <Form.Control type="email" value={email} onChange={handleInputChange} name="email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>PASSWORD</Form.Label>
                            <Form.Control type="password" value={password} onChange={handleInputChange} name="password" />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="dark" type="submit">REGISTER</Button>
                        </div>

                    </Form>

                </Col>
            </Row>
        </Container>
    )
}

export default SignupPage