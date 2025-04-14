import { useContext, useEffect, useState } from "react"
import userService from "../../services/user.service"
import { useNavigate } from "react-router-dom";

import { Row, Container, Form, Button, Col, Card } from "react-bootstrap"
import { AuthContext } from '../../contexts/auth.context'
import './CartPage.css';


const CartPage = () => {

    const { user } = useContext(AuthContext)
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) fetchUserDetails();
    }, [user]);


    const fetchUserDetails = async () => {
        try {
            const userDetails = await userService.getOneUser(user._id);
            console.log("User details:", userDetails.data);
            setCart(userDetails.data.cart); // Set the cart from user details
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const editCart = async (cartItemId, quantity) => {
        try {
            if (quantity === "0") {
                await userService.removeFromCart(user._id, cartItemId);
                setCart((prevCart) => prevCart.filter((item) => item._id !== cartItemId));
            } else {
                await userService.editCartItem(user._id, cartItemId, quantity);
                setCart((prevCart) =>
                    prevCart.map((item) =>
                        item._id === cartItemId ? { ...item, quantity } : item
                    )
                );
            }
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    };

    const getImageUrl = (product, options) => {
        const formatOption = (option) => option.toLowerCase().replace(/\s+/g, '-');

        if (product.title === "Bicycle") {
            const frameType = formatOption(options["Frame type"] || "full-suspension");
            const frameFinish = formatOption(options["Frame finish"] || "matte");
            const wheels = formatOption(options["Wheels"] || "road-wheels");
            const rimColor = formatOption(options["Rim color"] || "black");
            const chain = formatOption(options["Chain"] || "single-speed");

            return `/${frameType}/${frameFinish}_${wheels}_${rimColor}_${chain}.svg`;
        } else if (product.title === "Skis") {
            return "/skis/skis.svg";
        } else if (product.title === "Surf Board") {
            const color = formatOption(options["Color"] || "default");
            return `/surf-boards/surfboard-${color}.svg`;
        }
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
       <Container>
            <Row>
                <h1>YOUR CART</h1>
            </Row>

            <hr />
            
            <Row>
                <Col md={8} >
                    {cart.map((item, index) => (
                        <div key={index} className="cart-item d-flex align-items-center mb-3">
                            <img 
                                src={getImageUrl(item.product, item.options)} 
                                alt="Product Image" 
                                className="cart-image"
                            />

                            <div className="cart-item-details">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h4 className="m-0"> {item.product.title.toUpperCase()}</h4>
                                    <h6 className="m-0">Price: <span className="bold m-0">{item.price} €</span></h6>
                                </div>

                                <ul>
                                    {Object.entries(item.options).map(([key, value], idx) => (
                                        <li key={idx}>
                                            <span className="bold">{key}</span>: {value}
                                        </li>
                                    ))}
                                </ul>

                                <h6 className="mb-2">Total: <span className="bold">{item.price * item.quantity} €</span></h6>

                                {
                                    <Form.Control
                                        type="number"
                                        className="cart-quantity-input"
                                        min="0"
                                        value={item.quantity}
                                        onChange={(e) => editCart(item._id, e.target.value)}
                                    />
                                }
                            </div>
                        </div>
                    ))}
                </Col>

                <Col md={4}>
                    <Card className="cart-summary-card">
                        <Card.Body>
                            <h4>Total Price: <span className="bold">{calculateTotalPrice()} €</span></h4>
                            <Button 
                                variant="primary" 
                                className="mt-3 buy-button"
                                onClick={() => navigate('/purchase')}
                            >
                                Buy
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};

export default CartPage;
