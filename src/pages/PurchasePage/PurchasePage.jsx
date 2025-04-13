import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import Loader from '../../components/Loader/Loader'
import FormError from "../../components/FormError/FormError"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth.context"
import userService from '../../services/user.service'


const PurchasePage = () => {

    const [buyerData, setbuyerData] = useState({
        fullName: '',
        email: '',
        address: ''
    })

    const [cardNumber, setCardNumber] = useState('');
    const [expirationMonth, setExpirationMonth] = useState('');
    const [expirationYear, setExpirationYear] = useState('');
    const [cvv, setCvv] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState([])

    const navigate = useNavigate()

    const { user } = useContext(AuthContext)

    const PURCHASE_MONTHS_ARRAY = ['Jan', 'Feb', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic']
    const PURCHASE_YEARS_ARRAY = ['2025', '2026', '2027', '2028', '2029']

    const handleInputChange = event => {
        const { name, value } = event.target
        setbuyerData({ ...buyerData, [name]: value })
    }

    const isFormValid = () => {
        return buyerData.fullName && buyerData.email && buyerData.address && cardNumber && expirationMonth && expirationYear && cvv;
    };

    const handleSubmit = event => {
        event.preventDefault();

        const { address } = buyerData;
        const lastFourDigits = cardNumber.slice(-4); // Extract last 4 digits

        userService
            .buyProduct(user._id, address, lastFourDigits) // Pass last 4 digits
            .then((response) => {
                console.log("Purchase successful:", response.data);
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                    navigate(`/users/${user._id}`); // Redirect to purchases page
                }, 3000);
            })
            .catch(err => {
                console.log(err)
                setErrors(err.response.data.errorMessages);
            });
    }

    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>

                    <h1>Purchase</h1>
                    <hr />

                    <Form onSubmit={handleSubmit}>
                        <h5>Buyer Information</h5>

                        <Form.Group className="mb-3" controlId="fullName">
                            <Form.Label>Credit Card Name</Form.Label>
                            <Form.Control type="text" onChange={handleInputChange} name="fullName" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="cardNumber">
                            <Form.Label>Credit Card Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                            />
                        </Form.Group>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="expirationDate">
                                    <Form.Label>Expiration Month</Form.Label>
                                    <div className="expiration-date">
                                        <Form.Control
                                            as="select"
                                            value={expirationMonth}
                                            onChange={(e) => setExpirationMonth(e.target.value)}
                                        >
                                            <option value="">Month</option>
                                            {
                                                PURCHASE_MONTHS_ARRAY.map((elm, idx) => <option key={elm} value={idx < 10 ? `0${idx + 1}` : `${idx + 1}`}>{elm}</option>)
                                            }
                                        </Form.Control>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="expirationDate">
                                    <Form.Label>Expiration Year</Form.Label>

                                    <div className="expiration-date">

                                        <Form.Control
                                            as="select"
                                            value={expirationYear}
                                            onChange={(e) => setExpirationYear(e.target.value)}
                                        >
                                            <option value="">Year</option>
                                            {
                                                PURCHASE_YEARS_ARRAY.map((elm) => <option key={elm} value={elm}>{elm}</option>)
                                            }

                                        </Form.Control>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="cvv">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>@Email</Form.Label>
                            <Form.Control type="text" onChange={handleInputChange} name="email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="address">
                            <Form.Label>Shipment Details</Form.Label>
                            <Form.Control type="text" onChange={handleInputChange} name="address" />
                        </Form.Group>

                        {errors.length > 0 && <FormError>{errors.map((elm, idx) => <p key={idx}>{elm}</p>)}</FormError>}

                        {isLoading && <Loader />}

                        <div className="d-grid">
                            <Button variant="dark" type="submit" disabled={!isFormValid()}>BUY</Button>
                        </div>
                    </Form>

                </Col>
            </Row>
        </Container>
    )
}

export default PurchasePage