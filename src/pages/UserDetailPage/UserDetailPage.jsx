import { useContext, useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import userService from "../../services/user.service"
import { Row, Col, Container, Button, Modal, Card } from "react-bootstrap"
import EditUserForm from "../../components/EditUserForm/EditUserForm"
import Loader from "../../components/Loader/Loader"
import { AuthContext } from "../../contexts/auth.context"
import './UserDetailPage.css';

const UserDetailsPage = () => {

    const { _id } = useParams()

    const { user, logout } = useContext(AuthContext)

    const [profileUser, setProfileUser] = useState()
    const [showModalEdit, setshowModalEdit] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [])

    const loadUser = () => {
        userService
            .getOneUser(_id)
            .then(({ data }) => {
                setProfileUser(data)
            })
            .catch(err => console.log(err))
    }

    const handleDelete = () => {
        userService
            .deleteUser(_id)
            .then(() => {
                logout()
                navigate('/users/list')
            })
            .catch(err => console.log(err))
    }

    return (
        <Container className="user-details-container">
            {
                !profileUser
                    ?
                    <Loader />
                    :
                    <>
                        <div className="user-details-header">
                            <h2 className="profile-title"> {profileUser.username}</h2>
                            <span>
                            {profileUser.role === 'ADMIN' && <span className="badge ms-2">ADMIN</span>}
                            </span>
                        </div>
                        <hr />
                        
                        <h5>Purchased Products:</h5>
                        <Row>
                            {
                                profileUser?.purchasedProduct.length > 0
                                    ?
                                    profileUser.purchasedProduct.map(product => {
                                        return (
                                            <Col className="my-3" md={{ span: 4 }} key={product._id}>
                                                <Card className="product-card">
                                                    <Card.Img variant="top" src={product.image} />
                                                    <Card.Body >
                                                        <Card.Title className="product-card-title">{product.product.title}</Card.Title>
                                                        
                                                       
                                                        {Object.keys(product.options).length > 0 && (
                                                            <>
                                                                Options:
                                                                <ul>
                                                                    {Object.entries(product.options).map(([key, value]) => (
                                                                        <li key={key}>{key}: <span className="bold">{value}</span></li>
                                                                    ))}
                                                                </ul>
                                                            </>
                                                        )}
                                                      
                                                        
                                                        <Card.Text className="product-card-text d-flex justify-content-between">
                                                            <span>
                                                                <strong className="bold">Date:</strong> {new Date(product.purchaseDate).toISOString().split('T')[0]}
                                                            </span>
                                                            <span><strong className="bold">Price:</strong> {product.price} €</span>
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        )
                                    })
                                    :
                                    <p>No products purchased yet.</p>
                            }
                        </Row>

                        {
                            user?._id === _id || user?.role === 'ADMIN'
                            &&
                            <div className="fixed-action-container">
                                <Button className="mx-2 edit-btn" size="sm" onClick={() => setshowModalEdit(true)}>EDIT</Button>
                                <Button className="delete-btn" size="sm" onClick={() => handleDelete()}>DELETE</Button>
                            </div>
                        }

                        <Modal show={showModalEdit} onHide={() => setshowModalEdit(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit User</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <EditUserForm closeModal={() => setshowModalEdit(false)} updateList={loadUser} />
                            </Modal.Body>
                        </Modal>
                    </>
            }

        </Container>
    )
}

export default UserDetailsPage