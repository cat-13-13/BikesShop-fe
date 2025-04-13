import { useContext, useEffect, useState } from "react"
import { Container, Row, Modal, Button, Col } from "react-bootstrap"
import productService from "../../services/product.service"
import ProductsList from "../../components/ProductsList/ProductsList"
import NewProductForm from "../../components/NewProductForm/NewProductForm"
import Loader from "../../components/Loader/Loader"
import SearchBar from "../../components/SearchBar/SearchBar"
import { AuthContext } from "../../contexts/auth.context"

const ProductsListPage = () => {

    const [products, setProducts] = useState()
    const [showModal, setShowModal] = useState(false)
    const { user } = useContext(AuthContext)

    const [productsList, setProductsList] = useState(products)
    const [showFilteredProduct, setShowFilteredProduct] = useState()

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = () => {
        productService
            .getAllProducts()
            .then(({ data }) => {
                setProducts(data)
                setProductsList(data)
                updateList()
                closeModal()
            })
            .catch(err => console.log(err))
    }

    const updateList = () => {
        productService
            .getAllProducts()
            .then(({ data }) => {
                setProducts(data)
                setProductsList(data)
            })
            .catch(err => console.log(err))
    }

    const closeModal = () => {
        setShowModal(false)
    }

    useEffect(() => {
        let filterProduct = products?.filter(elm => {
            return elm.title.toLowerCase().includes(showFilteredProduct)
        })
        setProductsList(filterProduct)
    }, [showFilteredProduct])


    return (
        <Container>
            <Row>
                <Col>
                    <h1>PRODUCTS LIST</h1>
                    {
                        user?.role === 'ADMIN' && <Button variant="dark" size="sm" onClick={() => setShowModal(true)}>Sell New Product</Button>
                    }
                </Col>
                <Col className="mt-5">
                    <SearchBar setShowFilteredProduct={setShowFilteredProduct} />
                </Col>
            </Row>

            <hr />
            <Row>
                {
                    !products
                        ?
                        <Loader />
                        :
                        <ProductsList productsList={productsList} />
                }
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewProductForm closeModal={() => setShowModal(false)} updateList={loadProducts} />
                </Modal.Body>
            </Modal>

        </Container>
    )
}

export default ProductsListPage