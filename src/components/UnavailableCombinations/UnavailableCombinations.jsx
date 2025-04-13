import { Container, Row, Col, Form, Button } from "react-bootstrap";

const UnavailableCombinations = ({ 
    unavailableWith, 
    customizableParts, 
    setUnavailableWith, 
    partIndex,
    optionIndex
}) => {

    const handlePartChange = (index, value) => {
        const updatedCombinations = [...unavailableWith];
        updatedCombinations[index].part = value;
        setUnavailableWith(updatedCombinations);
    };

    const handleValueChange = (index, value) => {
        const updatedCombinations = [...unavailableWith];
        updatedCombinations[index].value = value;
        setUnavailableWith(updatedCombinations);
    };

    const handleRemoveCombination = (index) => {
        const updatedCombinations = [...unavailableWith];
        updatedCombinations.splice(index, 1);
        setUnavailableWith(updatedCombinations);
    };

    const handleAddCombination = () => {
        const updatedCombinations = unavailableWith || [];
        updatedCombinations.push({ part: '', value: '' });
        setUnavailableWith(updatedCombinations);
    };

    return (
        <div className="mt-2">
            {unavailableWith?.map((combination, index) => (
                <Container key={index} className="mb-3 border p-2 rounded">
                    <Row className="align-items-end mb-2">
                        <h6 className="mb-2 mt-1">Unavailable Combination {index + 1}:</h6>

                        <Col>
                            <Form.Group controlId={`unavailable-part-${partIndex}-${optionIndex}-${index}`}>
                                <Form.Label>Unavailable Part</Form.Label>
                                <Form.Select
                                    value={combination.part || ''}
                                    onChange={(e) => handlePartChange(index, e.target.value)}
                                >
                                    <option value="">Select a part</option>
                                    {customizableParts
                                        .filter((_, pIndex) => pIndex !== partIndex)
                                        .map((part, pIndex) => (
                                            <option key={pIndex} value={part.part}>
                                                {part.part}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId={`unavailable-value-${partIndex}-${optionIndex}-${index}`}>
                                <Form.Label>Unavailable Value</Form.Label>
                                <Form.Select
                                    value={combination.value || ''}
                                    onChange={(e) => handleValueChange(index, e.target.value)}
                                >
                                    <option value="">Select a value</option>
                                    {customizableParts
                                        .find(part => part.part === combination.part)?.options.map((option, optIndex) => (
                                            <option key={optIndex} value={option.name}>
                                                {option.name}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs="auto">
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRemoveCombination(index)}
                            >
                                Remove
                            </Button>
                        </Col>
                    </Row>
                </Container>
            ))}

            <Button
                size="sm"
                onClick={handleAddCombination}
                className="add-price-btn"
            >
                Add Unavailable Combination
            </Button>
        </div>
    );
};

export default UnavailableCombinations;
