import { Container, Row, Col, Form, Button } from "react-bootstrap";


const ConditionalPrices = ({
    conditionalPrices,
    partIndex,
    optionIndex,
    productData,
    handleConditionalPriceChange,
    addConditionalPrice,
    removeConditionalPrice
}) => {

    return (
        <div className="mt-3">
            {conditionalPrices.map((condPrice, condIndex) => (
                <Container key={condIndex} className="mb-3 border p-2 rounded">
                    <Row className="align-items-end mb-2">
                        <h6 className="mb-2 mt-1">Conditional Price {condIndex + 1} :</h6>
                        
                        <Col xs={12} className="d-flex align-items-center">
                            <Form.Group controlId={`condition-${partIndex}-${optionIndex}-${condIndex}`} className="me-3 w-50">
                                <Form.Label>Condition Part</Form.Label>

                                <Form.Select
                                    value={condPrice.condition.part || ''}
                                    onChange={(e) =>
                                        handleConditionalPriceChange(partIndex, optionIndex, condIndex, 'condition', {
                                            ...condPrice.condition,
                                            part: e.target.value
                                        })
                                    }
                                >
                                    <option value="">Select a part</option>
                                    {productData.customizableParts
                                        .filter((_, pIndex) => pIndex !== partIndex)
                                        .map((part, pIndex) => (
                                            <option key={pIndex} value={part.part}>
                                                {part.part}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId={`condition-value-${partIndex}-${optionIndex}-${condIndex}`} className="w-50">
                                <Form.Label>Condition Value</Form.Label>
                                <Form.Select
                                    value={condPrice.condition.value || ''}
                                    onChange={(e) =>
                                        handleConditionalPriceChange(partIndex, optionIndex, condIndex, 'condition', {
                                            ...condPrice.condition,
                                            value: e.target.value
                                        })
                                    }
                                >
                                    <option value="">Select a value</option>
                                    {productData.customizableParts
                                        .find(part => part.part === condPrice.condition.part)?.options.map((option, optIndex) => (
                                            <option key={optIndex} value={option.name}>
                                                {option.name}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="align-items-end mb-2">
                        <Col>
                            <Form.Group controlId={`cond-price-${partIndex}-${optionIndex}-${condIndex}`}>
                                <Form.Label>Price (€)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={condPrice.price || 0}
                                    onChange={(e) =>
                                        handleConditionalPriceChange(partIndex, optionIndex, condIndex, 'price', parseFloat(e.target.value) || 0)
                                    }
                                />
                            </Form.Group>
                        </Col>

                        <Col xs="auto">
                            <Button
                                className="delete-category-btn"
                                size="sm"
                                onClick={() => removeConditionalPrice(partIndex, optionIndex, condIndex)}
                            >
                                Remove
                            </Button>
                        </Col>
                    </Row>
                </Container>
            ))}

            <Button
                size="sm"
                onClick={() => addConditionalPrice(partIndex, optionIndex)}
                className="mt-0 add-price-btn"
            >
                Add Conditional Price
            </Button>
        </div>
    );
};

export default ConditionalPrices;
