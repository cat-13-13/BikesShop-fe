import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { useState, useContext } from "react"
import authService from './../../services/auth.service'
import { useNavigate } from "react-router-dom"
import { UserContext } from '../../contexts/user.context'
import FormError from './../../components/FormError/FormError'

const SignupPage = () => {

    const [signupData, setSignupData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [errorMessage, setErrorMessage] = useState('') 

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
            .then(() => {
                return authService.login({ email: signupData.email, password: signupData.password })
            })
            .then(async ({ data }) => {
                localStorage.setItem('authToken', data.authToken)
                await setUser(data.user)

                const redirectToHome = () => navigate('/');
                const checkUser = setInterval(() => {
                    if (localStorage.getItem('authToken')) {
                        clearInterval(checkUser);
                        redirectToHome();
                    }
                }, 100);
            })
            .catch(err => {
                setErrorMessage(err.response?.data?.message || 'Something went wrong') 
            })
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

                        {errorMessage && <FormError>{errorMessage}</FormError>} {/* Display FormError if there's an error */}

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