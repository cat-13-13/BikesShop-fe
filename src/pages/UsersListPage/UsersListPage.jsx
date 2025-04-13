import { useEffect, useState } from "react"
import { Container, Row, Col, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import userService from "../../services/user.service"
import Loader from "../../components/Loader/Loader"

const UserListPage = () => {

    const [users, setUsers] = useState()

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = () => {
        userService
            .getAllUsers()
            .then(({ data }) => setUsers(data))
            .catch(err => console.log(err))
    }

    return (
        <Container>
            <h1>USERS LIST</h1>
            <hr />
            
            <Row>
                {
                    !users
                        ?
                        <Loader />
                        :
                        users.map(user => (
                            <Col md={{ span: 4 }} key={user._id} className="mb-3">
                                <Card className="mb-3 UserCard">
                                    <Link to={`/users/${user._id}`} className="btn btn-sl">
                                        <Card.Body className="userBody">
                                            <Card.Title className="userTitle"><h4>{user.username}</h4></Card.Title>
                                        </Card.Body>
                                    </Link>
                                </Card>
                            </Col>
                        ))
                }
            </Row>
        </Container>
    )
}

export default UserListPage