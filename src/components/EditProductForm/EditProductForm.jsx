import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Form, Button, Row, Col, Container } from "react-bootstrap"
import productService from "../../services/product.service"
import './EditProductForm.css'
import OptionDetails from "../OptionDetails/OptionDetails";

const EditProductForm = ({ closeModal, updateList }) => {

    const [productData, setProductData] = useState({
        title: '',
        basePrice: '',
        isCustomizable: false,
        customizableParts: [],
        inStock: true,
        unavailableWith: []
    })

    const { _id } = useParams()

    useEffect(() => {
        loadProduct()
    }, [])

    const loadProduct = () => {
        productService
            .getOneProduct(_id)
            .then(({ data }) => {
                console.log(data)
                setProductData({
                    title: data.title || '',
                    basePrice: data.basePrice || '',
                    isCustomizable: data.isCustomizable || false,
                    customizableParts: data.customizableParts || [],
                    inStock: data.inStock || true,
                    unavailableWith: data.unavailableWith || []
                })
            })
            .catch(err => console.log(err))
    }

    const handleInputChange = event => {
        const { name, value, type, checked } = event.target
        const inputValue = type === 'checkbox' ? checked : value
        setProductData({ ...productData, [name]: inputValue })
    }

    const handleCustomizablePartsChange = (index, field, value) => {
        const updatedParts = [...productData.customizableParts]
        updatedParts[index][field] = value || ''
        setProductData({ ...productData, customizableParts: updatedParts })
    }

    const addCustomizablePart = () => {
        setProductData({
            ...productData,
            customizableParts: [...productData.customizableParts, { part: '', options: [] }]
        })
    }

    const addOptionToPart = (index) => {
        const updatedParts = [...productData.customizableParts]
        updatedParts[index].options.push({ name: '', price: 0, inStock: true, conditionalPrices: [] })
        setProductData({ ...productData, customizableParts: updatedParts })
    }

    const addConditionalPrice = (partIndex, optionIndex) => {
        const updatedParts = [...productData.customizableParts];
        updatedParts[partIndex].options[optionIndex].conditionalPrices.push({ condition: '', price: 0 });
        setProductData({ ...productData, customizableParts: updatedParts });
    };

    const handleConditionalPriceChange = (partIndex, optionIndex, condIndex, field, value) => {
        const updatedParts = [...productData.customizableParts];
        updatedParts[partIndex].options[optionIndex].conditionalPrices[condIndex][field] = value || '';
        setProductData({ ...productData, customizableParts: updatedParts });
    };

    const removeConditionalPrice = (partIndex, optionIndex, condIndex) => {
        const updatedParts = [...productData.customizableParts];
        updatedParts[partIndex].options[optionIndex].conditionalPrices.splice(condIndex, 1);
        setProductData({ ...productData, customizableParts: updatedParts });
    };

    const handleSubmit = event => {
        event.preventDefault()

        console.log(productData)
        productService
            .editProduct(_id, productData)
            .then(() => {
                closeModal()
                updateList()
            })
            .catch(err => console.log(err))
    }

    const { title, basePrice, isCustomizable, customizableParts, inStock } = productData

    return (
        <Form onSubmit={handleSubmit} className="edit-product-form">
            <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title || ''} onChange={handleInputChange} name="title" />
            </Form.Group>

            <Row className="d-flex align-items-end">
                <Col>
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Base Price (€)</Form.Label>
                        <Form.Control type="number" value={basePrice || ''} onChange={handleInputChange} name="basePrice" />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3 d-flex align-items-center" controlId="inStock">
                        <Form.Check 
                            type="checkbox" 
                            checked={inStock || false} 
                            onChange={handleInputChange} 
                            name="inStock" 
                            title="Check this box if the product is currently available in stock."
                            className="me-2"
                        />
                        <Form.Label className="mb-0">In Stock</Form.Label>
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3 d-flex align-items-center" controlId="isCustomizable">
                <Form.Check 
                    type="checkbox" 
                    checked={isCustomizable || false} 
                    onChange={handleInputChange} 
                    name="isCustomizable" 
                    className="me-2"
                />
                <Form.Label className="mb-0">Customizable</Form.Label>
            </Form.Group>

            <hr/>

            {isCustomizable && (
                <>
                    {customizableParts.map((part, index) => (
                        <div key={index} className="mb-3">
                            <Form.Group controlId={`part-${index}`} className="mb-4">
                                <Form.Label>Part Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={part.part || ''}
                                    onChange={(e) => handleCustomizablePartsChange(index, 'part', e.target.value)}
                                />
                            </Form.Group>

                            {part.options.map((option, optIndex) => (
                                <div key={optIndex} className="mb-4 border p-3 rounded">
                                    <Button
                                        variant="link"
                                        className="text-decoration-none w-100 text-start drop-down-toggle"
                                        onClick={() => {
                                            const updatedParts = [...productData.customizableParts];
                                            updatedParts[index].options[optIndex].isExpanded = !option.isExpanded;
                                            setProductData({ ...productData, customizableParts: updatedParts });
                                        }}
                                    >
                                        {option.name || `Option ${optIndex + 1}`}&nbsp;&nbsp; {option.isExpanded ? "🡅" : "🡇"}
                                    </Button>

                                    {option.isExpanded && (
                                        <OptionDetails
                                            partIndex={index}
                                            optionIndex={optIndex}
                                            option={option}
                                            part={part}
                                            productData={productData}
                                            handleCustomizablePartsChange={handleCustomizablePartsChange}
                                            handleConditionalPriceChange={handleConditionalPriceChange}
                                            addConditionalPrice={addConditionalPrice}
                                            removeConditionalPrice={removeConditionalPrice}
                                            setProductData={setProductData}
                                        />
                                    )}
                                </div>
                            ))}

                            <Button size="sm" onClick={() => addOptionToPart(index)} className="mb-2 add-option-btn">Add Option</Button>

                            <hr/>
                        </div>

                    ))}

                    <Button onClick={addCustomizablePart} className="mb-3 add-category-btn">Add Customizable Part</Button>

                </>
            )}

            <div className="d-grid">
                <Button variant="dark" type="submit">Update</Button>
            </div>
        </Form>
    )
}

export default EditProductForm