import { useState } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import productService from "../../services/product.service"
import FormError from "../FormError/FormError"

const NewProductForm = ({ closeModal, updateList }) => {
    const [productData, setProductData] = useState({
        title: '',
        basePrice: '',
        isCustomizable: false,
        customizableParts: []
    });

    const { title, basePrice, isCustomizable, customizableParts } = productData;


    const [errors, setErrors] = useState([]);


    const handleAddPart = () => {
        setProductData({
            ...productData,
            customizableParts: [
                ...customizableParts,
                { part: '', options: [] }
            ]
        });
    };

    const handleRemovePart = (partIndex) => {
        const updatedParts = customizableParts.filter((_, index) => index !== partIndex);
        setProductData({ ...productData, customizableParts: updatedParts });
    };

    const handlePartChange = (partIndex, field, value) => {
        const updatedParts = [...customizableParts];
        updatedParts[partIndex][field] = value;
        setProductData({ ...productData, customizableParts: updatedParts });
    };

    const handleAddOption = (partIndex) => {
        const updatedParts = [...customizableParts];
        updatedParts[partIndex].options.push({
            name: '',
            price: 0,
            inStock: true,
            conditionalPrices: [],
            unavailableWith: []
        });
        setProductData({ ...productData, customizableParts: updatedParts });
    };

    const handleRemoveOption = (partIndex, optionIndex) => {
        const updatedParts = [...customizableParts];
        updatedParts[partIndex].options = updatedParts[partIndex].options.filter((_, index) => index !== optionIndex);
        setProductData({ ...productData, customizableParts: updatedParts });
    };

    const handleOptionChange = (partIndex, optionIndex, field, value) => {
        const updatedParts = [...customizableParts];
        updatedParts[partIndex].options[optionIndex][field] = value;
        setProductData({ ...productData, customizableParts: updatedParts });
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleSubmit = event => {
        event.preventDefault();

        const productDataToSubmit = { ...productData };
        console.log(productDataToSubmit);

        productService
            .saveProduct(productDataToSubmit)
            .then(() => {
                updateList();
                closeModal();
            })
            .catch(err => {
                setErrors(err.response.data.errorMessages);
            });
    };


    return (
        <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
            type="text"
            value={title}
            onChange={handleInputChange}
            name="title"
            />
        </Form.Group>

        <Row className="align-items-end">
            <Col>
                <Form.Group className="mb-3" controlId="basePrice">
                    <Form.Label>Base Price (€)</Form.Label>
                    <Form.Control
                    type="number"
                    value={basePrice}
                    onChange={handleInputChange}
                    name="basePrice"
                    />
                </Form.Group>
            </Col>

            <Col>
                <Form.Group className="mb-3 d-flex align-items-end" controlId="isCustomizable">
                    <Form.Label className="me-2 mb-0">Customizable</Form.Label>
                    <Form.Check
                        type="switch"
                        checked={isCustomizable}
                        onChange={(e) => setProductData({ ...productData, isCustomizable: e.target.checked })}
                        name="isCustomizable"
                        label={isCustomizable ? "Yes" : "No"}
                    />
                </Form.Group>
            </Col>
        </Row>

        {isCustomizable && (
            <div>
                {customizableParts.map((part, partIndex) => (
                    <div key={partIndex} className="mb-4">
                        <Row className="align-items-end">
                            <Col>
                                <Form.Group controlId={`part-${partIndex}`}>
                                    <Form.Label>Category Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={part.part}
                                        onChange={(e) => handlePartChange(partIndex, 'part', e.target.value)}
                                        placeholder="Enter category name"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs="auto">
                                <Button size="sm" className="delete-category-btn" onClick={() => handleRemovePart(partIndex)}>Remove Category</Button>
                            </Col>
                        </Row>

                        {part.options.map((option, optionIndex) => (
                            <Row key={optionIndex} className="mt-3 align-items-end">
                                <Col>
                                    <Form.Group controlId={`option-name-${partIndex}-${optionIndex}`}>
                                        <Form.Label>Option Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={option.name}
                                            onChange={(e) => handleOptionChange(partIndex, optionIndex, 'name', e.target.value)}
                                            placeholder="Enter option name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId={`option-price-${partIndex}-${optionIndex}`}>
                                        <Form.Label>Price (€)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={option.price}
                                            onChange={(e) => handleOptionChange(partIndex, optionIndex, 'price', parseFloat(e.target.value))}
                                            placeholder="Enter price"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs="auto">
                                    <Form.Check
                                        type="checkbox"
                                        label="In Stock"
                                        checked={option.inStock}
                                        onChange={(e) => handleOptionChange(partIndex, optionIndex, 'inStock', e.target.checked)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button size="sm" className="delete-category-btn" onClick={() => handleRemoveOption(partIndex, optionIndex)}>Remove</Button>
                                </Col>
                            </Row>
                        ))}

                        <Button className="add-option-btn mt-2" size="sm" onClick={() => handleAddOption(partIndex)}>
                            Add Option
                        </Button>
                    </div>
                ))}
                
                <Button className="add-category-btn mb-3" size="sm" onClick={handleAddPart}>Add Category</Button>
            </div>
        )}

        {errors.length > 0 && <FormError>{errors.map(elm => <p>{elm}</p>)}</FormError>}

        <div className="d-grid">
            <Button variant="dark" type="submit">
            Upload
            </Button>
        </div>
        </Form>
    );
};

export default NewProductForm;
