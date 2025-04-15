import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useContext, useState } from "react"
import authService from './../../services/auth.service'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from "./../../contexts/auth.context"
import FormError from './../../components/FormError/FormError'

const LoginPage = ({ onBack }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const [errorMessage, setErrorMessage] = useState('') 

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
                console.log('Login successful', data)
                storeToken(data.authToken)
                authenticateUser()
                navigate('/')
            })
            .catch(err => {
                console.log(err)
                setErrorMessage(err.response?.data?.message || 'Something went wrong')
            })
    }


    const { password, email } = loginData

    return (
        <Container className='shadow-bg'>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>

                    <h3 className="accent-color">Log In</h3>
                    <hr />

                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label className='accent-color'>@EMAIL</Form.Label>
                            <Form.Control type="email" value={email} onChange={handleInputChange} name="email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className='accent-color'>PASSWORD</Form.Label>
                            <Form.Control type="password" value={password} onChange={handleInputChange} name="password" />
                        </Form.Group>

                        {errorMessage && <FormError>{errorMessage}</FormError>}

                        <div className="d-grid">
                            <Button className='shop-now-btn' variant="dark" type="submit">GO!</Button>
                        </div>

                    </Form>
                    <Button className='back-btn' variant="link" onClick={onBack}>Back</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage