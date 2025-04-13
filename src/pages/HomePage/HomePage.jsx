import { Col, Container, Row } from "react-bootstrap"
import productService from "../../services/product.service"
import Loader from "../../components/Loader/Loader"
import ProductsList from "../../components/ProductsList/ProductsList"
import { useEffect, useState } from "react"

const HomePage = () => {

    const [productsList, setProductsList] = useState()

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = () => {
        productService
            .getAllProducts()
            .then(({ data }) => {
                setProductsList(data);
            })
            .catch(err => console.log(err))
    }

    return (
        <Container>
            <Row className="justify-content-center mt-5 mb-5">
                <Col md={{ span: 8 }}>
                    <h2 style={{ textAlign: "center" }}>ARTICLES</h2>
                    <hr />
                </Col>
            </Row>

            <Row className="justify-content-center mb-5">
                {
                    !productsList
                        ? <Loader />
                        : productsList.length > 0
                            ? <ProductsList productsList={productsList} />
                            : <p style={{ textAlign: "center" }}>Ahora mismo no tenemos productos disponibles, vuelve más tarde.</p>
                }
            </Row>
        </Container>
    )
}

export default HomePage