import { Form, Row, Col } from "react-bootstrap";
import ConditionalPrices from "../ConditionalPrices/ConditionalPrices";
import UnavailableCombinations from "../UnavailableCombinations/UnavailableCombinations";


const OptionDetails = ({
    partIndex,
    optionIndex,
    option,
    part,
    productData,
    handleCustomizablePartsChange,
    handleConditionalPriceChange,
    addConditionalPrice,
    removeConditionalPrice,
    setProductData
}) => {

    const setUnavailableWith = (updatedCombinations) => {
        const updatedParts = [...productData.customizableParts];

        // 1. Guardar parte y opción actual
        const currentPartName = part.part;
        const currentOptionName = option.name;

        // 2. Limpiar referencias cruzadas anteriores
        updatedParts.forEach((p, pIndex) => {
            p.options.forEach((opt, oIndex) => {
                if (pIndex !== partIndex || oIndex !== optionIndex) {
                    opt.unavailableWith = (opt.unavailableWith || []).filter(
                        (uw) => !(uw.part === currentPartName && uw.value === currentOptionName)
                    );
                }
            });
        });

        // 3. Setear parte actual
        updatedParts[partIndex].options[optionIndex].unavailableWith = updatedCombinations;

        // 4. Para cada combinación, agregar la inversa
        updatedCombinations.forEach((comb) => {
            const targetPartIndex = updatedParts.findIndex(p => p.part === comb.part);
            if (targetPartIndex === -1) return;

            const targetOptionIndex = updatedParts[targetPartIndex].options.findIndex(opt => opt.name === comb.value);
            if (targetOptionIndex === -1) return;

            const targetOption = updatedParts[targetPartIndex].options[targetOptionIndex];
            if (!targetOption.unavailableWith) targetOption.unavailableWith = [];

            const alreadyExists = targetOption.unavailableWith.some(
                uw => uw.part === currentPartName && uw.value === currentOptionName
            );
            if (!alreadyExists) {
                targetOption.unavailableWith.push({
                    part: currentPartName,
                    value: currentOptionName
                });
            }
        });

        // 5. Guardar el nuevo estado
        setProductData({ ...productData, customizableParts: updatedParts });
    }

    return (
        <>
            <Form.Group controlId={`option-${partIndex}-${optionIndex}`} className="mb-2">
                <Form.Label>Option Name</Form.Label>
                <Form.Control
                    type="text"
                    value={option.name || ''}
                    onChange={(e) => {
                        const updatedOptions = [...part.options];
                        updatedOptions[optionIndex].name = e.target.value || '';
                        handleCustomizablePartsChange(partIndex, 'options', updatedOptions);
                    }}
                />
            </Form.Group>

            <Row className="d-flex align-items-end mb-2">
                <Col>
                    <Form.Group controlId={`option-price-${partIndex}-${optionIndex}`}>
                        <Form.Label>Option Price (€)</Form.Label>
                        <Form.Control
                            type="number"
                            value={option.price || 0}
                            onChange={(e) => {
                                const updatedOptions = [...part.options];
                                updatedOptions[optionIndex].price = parseFloat(e.target.value) || 0;
                                handleCustomizablePartsChange(partIndex, 'options', updatedOptions);
                            }}
                        />
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group controlId={`option-stock-${partIndex}-${optionIndex}`} className="d-flex align-items-center">
                        <Form.Check
                            type="checkbox"
                            checked={option.inStock || false}
                            onChange={(e) => {
                                const updatedOptions = [...part.options];
                                updatedOptions[optionIndex].inStock = e.target.checked;
                                handleCustomizablePartsChange(partIndex, 'options', updatedOptions);
                            }}
                            className="me-2"
                        />
                        <Form.Label className="mb-0">In Stock</Form.Label>
                    </Form.Group>
                </Col>
            </Row>

            <ConditionalPrices
                conditionalPrices={option.conditionalPrices}
                partIndex={partIndex}
                optionIndex={optionIndex}
                productData={productData}
                handleConditionalPriceChange={handleConditionalPriceChange}
                addConditionalPrice={addConditionalPrice}
                removeConditionalPrice={removeConditionalPrice}
            />

            <UnavailableCombinations
                unavailableWith={option.unavailableWith || []}
                customizableParts={productData.customizableParts}
                setUnavailableWith={setUnavailableWith}
                partIndex={partIndex}
                optionIndex={optionIndex}
            />
        </>
    );
};

export default OptionDetails;
