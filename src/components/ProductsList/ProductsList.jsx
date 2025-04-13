import { Col, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

import "./ProductsList.css"

const ProductsList = ({ productsList }) => {
    const calculateMinPrice = (basePrice, customizableParts) => {
        return customizableParts.reduce((total, part) => {
            if (part.options.length > 0) {
                return total + Math.min(...part.options.map(option => option.price || 0))
            }
            return total
        }, basePrice)
    }

    return (
        productsList?.map(product =>{
            const { title, basePrice, isCustomizable, customizableParts, _id } = product
            return (
               <Col md={{ span: 3 }} key={_id} className="mb-3">
                <Link to={`/products/${_id}`} className="product-card-link">
                    <Card className="product-card-container">
                        <Card.Body className="product-card-body">
                            <Card.Title>
                                <h5 className="card-title">{isCustomizable && 'Customizable'} {title}</h5>
                                <p>
                                    {isCustomizable ? `Desde ${calculateMinPrice(basePrice, customizableParts)} €` : `${basePrice} €`}
                                </p>
                            </Card.Title>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
            )
        })
    )
}

export default ProductsList