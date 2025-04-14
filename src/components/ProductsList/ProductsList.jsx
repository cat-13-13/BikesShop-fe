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

    const getImageUrl = (product) => {
        if (product.title === "Bicycle") {
            return "/full-suspension/matte_road-wheels_black_8-speed.svg";
        } else if (product.title === "Skis") {
            return "/skis/skis.svg";
        } else if (product.title === "Surf Board") {
            return "/surf-boards/surfboard-blue.svg";
        }
    };

    return (
        productsList?.map(product => {
            const { title, basePrice, isCustomizable, customizableParts, _id } = product;
            return (
                <Col md={{ span: 3 }} key={_id} className="mb-3 product-card-container">
                    <Link to={`/products/${_id}`} className="product-card-link">
                        <Card >
                            <Card.Img 
                                variant="top" 
                                src={getImageUrl(product)} 
                                alt={`${title} image`} 
                                className="product-card-image" 
                            />
                            <Card.Body className="product-card-body">
                                <Card.Title>
                                    <h5 className="card-title">{isCustomizable && 'Customizable'} {title}</h5>
                                    <div className="price-container">
                                        {isCustomizable ? `Desde ${calculateMinPrice(basePrice, customizableParts)} €` : `${basePrice} €`}
                                    </div>
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            );
        })
    );
}

export default ProductsList