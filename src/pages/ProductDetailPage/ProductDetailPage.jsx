import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import productService from "../../services/product.service"
import userService from "../../services/user.service"

import { Row, Col, Container, Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap"
import { AuthContext } from '../../contexts/auth.context'
import EditProductForm from '../EditProductPage/EditProductPage'
import Loader from "../../components/Loader/Loader"
import './ProductDetailPage.css';
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";

const ProductDetailsPage = () => {

    const { _id } = useParams()
    const { user } = useContext(AuthContext)

    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [product, setProduct] = useState()

    const [selectedOptions, setSelectedOptions] = useState({});

    const navigate = useNavigate()

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        productService
            .getOneProduct(_id)
            .then(({ data }) => {
                setProduct(data);
            })
            .catch(err => console.log(err));
    };


    useEffect(() => {
        if (product) {
            handleStartOptions();
        }
    }, [product]);

    const handleStartOptions = () => {
        if(product?.title == "Bicycle"){
            const initialOptions = {
                "Frame type": product.customizableParts[0].options.find(option => option.inStock)?.name || "",
                "Frame finish": product.customizableParts[1].options.find(option => option.inStock)?.name || "",
                "Wheels": product.customizableParts[2].options.find(option => option.inStock)?.name || "",
                "Rim color": product.customizableParts[3].options.find(option => option.inStock)?.name || "",
                "Chain": product.customizableParts[4].options.find(option => option.inStock)?.name || ""
            };
            setSelectedOptions(initialOptions);
        } 
        else if(product?.title == "Skis") return
        else if(product?.title == "Surf Board"){
            const initialOptions = {
                "Color": product.customizableParts[0].options[0].name
            };
            setSelectedOptions(initialOptions);
        }
    }


    const handleDelete = () => {
        productService
            .deleteProduct(_id)
            .then(() => {
                console.log("Product deleted successfully!");
                navigate('/');
            })
            .catch(err => console.log(err))
            .finally(() => {
                const cartItem = user.cart.find(item => item.product.toString() === _id);
                
                if (cartItem) {
                    userService
                        .removeFromCart(user._id, cartItem._id)
                        .then(() => console.log("Product removed from cart successfully!"))
                        .catch(err => console.log("Error removing product from cart:", err));
                } else {
                    console.log("Product not found in cart, nothing to remove.");
                }
            });
    }

    const handleDeleteConfirm = () => {
        setShowDeleteModal(false);
        handleDelete();
    };

    const handleOptionChange = (part, option) => {
        setSelectedOptions(prevState => {
            const updatedOptions = {
                ...prevState,
                [part]: option.name
            };

            return updatedOptions;
        });
    };


    const addToCart = () => {
        const optionsToSave = product?.isCustomizable
            ? Object.entries(selectedOptions).reduce((acc, [part, option]) => {
                acc[part] = option;
                return acc;
            }, {})
            : {};

        userService
            .addToCart(user._id, _id, optionsToSave, calculateTotalPrice(), product.title)
            .then(() => {
                console.log("Product added to cart successfully!");
                navigate('/cart');
            })
            .catch(err => console.log(err));
    };


    const calculateTotalPrice = () => {
        const optionsPrice = Object.entries(selectedOptions).reduce((acc, [part, optionName]) => {
            const partDetails = product.customizableParts.find(p => p.part === part);
            const optionDetails = partDetails?.options.find(o => o.name === optionName);

            let finalPrice = optionDetails?.price || 0;

            if (optionDetails?.conditionalPrices?.length) {
                const applicableCondition = optionDetails.conditionalPrices.find(({ condition }) => {
                    const selected = selectedOptions[condition.part];
                    return selected && selected === condition.value;
                });

                if (applicableCondition) {
                    finalPrice = applicableCondition.price;
                }
            }

            return acc + finalPrice;
        }, 0);

        return (product?.basePrice || 0) + optionsPrice;
    };


    const getImageUrl = () => {
        if (product?.title == "Bicycle") {

            const formatOption = (option) => option.toLowerCase().replace(/\s+/g, '-');
            
            const frameType = formatOption(selectedOptions["Frame type"] || "full-suspension");
            const frameFinish = formatOption(selectedOptions["Frame finish"] || "matte");
            const wheels = formatOption(selectedOptions["Wheels"] || "road-wheels");
            const rimColor = formatOption(selectedOptions["Rim color"] || "black");
            const chain = formatOption(selectedOptions["Chain"] || "single-speed");
            
            return `/${frameType}/${frameFinish}_${wheels}_${rimColor}_${chain}.svg`;
        }
        else if (product?.title == "Skis") {
            return "/skis/skis.svg";
        }
        else if (product?.title == "Surf Board") {
            const color = (selectedOptions["Color"] || "default").toLowerCase().replace(/\s+/g, '-');
            return `/surf-boards/surfboard-${color}.svg`;
        }
        else return "/favicon.svg";
    };

    const isAddToCartDisabled = product?.isCustomizable && product.customizableParts.some(part => !selectedOptions[part.part]);

    return (
        <Container>
            <div className="detailsCard">
                {!product ?
                    <Loader />
                    :
                    <>
                        <Row className="align-items-end">
                            <Col>
                                <h2 className="productTitle">{product.title}</h2>
                            </Col>

                            <Col className="text-end">
                                <h2>{calculateTotalPrice()} €</h2>
                            </Col>
                        </Row>

                        <hr />

                        <Row>
                            <Col md={{ span: 4 }} >
                                <Row className="align-items-center justify-content-center mb-3">
                                    {getImageUrl() ? (
                                        <img 
                                            src={getImageUrl()} 
                                            alt="Custom Bike" 
                                            className="product-image"
                                        />
                                    ) : (
                                        <p>Image not available for this product.</p>
                                    )}
                                </Row>

                                <Row>
                                    {
                                        user?.role === 'ADMIN' &&
                                        <>
                                            <Button size="sm" className="edit-btn mb-2" onClick={() => setShowModal(true)}>EDIT</Button>
                                            <Button className="delete-btn" size="sm" onClick={() => setShowDeleteModal(true)}>DELETE</Button>
                                        </>
                                    }
                                </Row>
                            </Col>

                            <Col md={{ span: 8 }}>
                                {
                                    product.isCustomizable &&
                                    <>
                                        <h4>Customize Your Product</h4>
                                        {
                                            product.customizableParts.map((part, idx) => (
                                                <div key={idx} className="customizable-part mb-3">
                                                    <h5>{part.part}</h5>
                                                    {
                                                        part.options.map((option, optIdx) => {
                                                            const isDisabled = option.unavailableWith?.some(({ part: unavailablePart, value }) => {
                                                                const selected = selectedOptions[unavailablePart];
                                                                return selected && selected === value;
                                                            });

                                                            const tooltipText = isDisabled
                                                                ? "This option is unavailable due to a conflicting selection."
                                                                : !option.inStock
                                                                ? "This option is out of stock."
                                                                : "";

                                                            return (
                                                                tooltipText ? (
                                                                    <OverlayTrigger
                                                                        key={optIdx}
                                                                        placement="top"
                                                                        overlay={<Tooltip>{tooltipText}</Tooltip>}
                                                                    >
                                                                        <Button
                                                                            className={`mx-1 my-1 option-btn ${selectedOptions[part.part] === option.name ? "selected" : ""} ${isDisabled || !option.inStock ? "disabled" : ""}`}
                                                                            onClick={() => handleOptionChange(part.part, option)}
                                                                            disabled={isDisabled || !option.inStock}
                                                                        >
                                                                            {option.name}
                                                                        </Button>
                                                                    </OverlayTrigger>
                                                                ) : (
                                                                    <Button
                                                                        key={optIdx}
                                                                        className={`mx-1 my-1 option-btn ${selectedOptions[part.part] === option.name ? "selected" : ""} ${isDisabled || !option.inStock ? "disabled" : ""}`}
                                                                        onClick={() => handleOptionChange(part.part, option)}
                                                                        disabled={isDisabled || !option.inStock}
                                                                    >
                                                                        {option.name}
                                                                    </Button>
                                                                )
                                                            );
                                                        })
                                                    }
                                                </div>
                                            ))
                                        }
                                    </>
                                }
                                
                                <Button 
                                    className="save-btn mt-3" 
                                    onClick={addToCart} 
                                    disabled={isAddToCartDisabled}
                                >
                                    Add to Cart
                                </Button>
                            </Col>
                        </Row>

                        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title className="modal-title">Edit Product</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <EditProductForm closeModal={() => setShowModal(false)} updateList={loadProduct} />
                            </Modal.Body>
                        </Modal>

                        <DeleteConfirmationModal
                            show={showDeleteModal}
                            onHide={() => setShowDeleteModal(false)}
                            onConfirm={handleDeleteConfirm}
                        />
                    </>
                }
            </div>
        </Container>
    )
}

export default ProductDetailsPage