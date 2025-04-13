import { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function SearchBar({ setShowFilteredProduct }) {

    const [query, setQuery] = useState('');

    const handleQueryChange = e => {
        const inputValue = e.target.value
        setQuery(inputValue)
        setShowFilteredProduct(inputValue)
    }

    return (
        <>
            <FloatingLabel
                controlId="floatingInput"
                label="Search by Product Name..."
                className="mb-3 searchBar"
            >
                <Form.Control type="text" placeholder="Product" value={query} onChange={handleQueryChange} />
            </FloatingLabel>
        </>
    )
}

export default SearchBar