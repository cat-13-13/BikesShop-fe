import { useContext } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth.context'
import { FaShoppingCart } from 'react-icons/fa';
import './Navigation.css'


const Navigation = () => {

    const { user, logout } = useContext(AuthContext)

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <Navbar className="shadow-sm p-3 mb-3 bg-white rounded navbarDetails" expand="lg" bg="white" variant="light">
            <Container>

                <Navbar.Brand href="/" className='brand-name'>marKus_biKus</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    {
                        user
                            ?
                            <>
                                <Nav className="me-auto">
                                    <Nav.Link as="span">
                                        <Link to="/" className='nav-title'>Shop</Link>
                                    </Nav.Link>

                                    {user?.role === 'ADMIN' && (
                                        <Nav.Link as="span">
                                            <Link to="/users/list" className='nav-title'>Users</Link>
                                        </Nav.Link>
                                    )}
                                </Nav>

                                <Nav className="ms-auto">
                                    <Nav.Link as="span">
                                        <Link to={`/users/${user._id}`} className='nav-title'>Profile</Link>
                                    </Nav.Link>

                                    <Nav.Link as="span">
                                        <Link to={`/cart`} className='nav-title'>
                                            <FaShoppingCart className="me-1" />
                                            ({user.cart?.length || 0})
                                        </Link>
                                    </Nav.Link>

                                    <Nav.Link className='logout pointer' as="span" onClick={handleLogout}>Logout</Nav.Link>
                                </Nav>
                            </>
                            :
                            <>
                                <Nav.Link as="span">
                                    <Link to="/landing" className='nav-title'>Sign Up</Link>
                                </Nav.Link>

                                <Nav.Link as="span">
                                    <Link to="/landing" className='nav-title'>Login</Link>
                                </Nav.Link>
                            </>
                    }
                </Navbar.Collapse>

            </Container>
        </Navbar >
    );
}

export default Navigation