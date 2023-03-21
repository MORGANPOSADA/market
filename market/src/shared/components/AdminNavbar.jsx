import React from 'react';
import { useContext } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../modules/auth/authContext';

export const AdminNavbar = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/auth', { replace: true });
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">LOGO</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Link to="/" className="ms-1 nav-link">
              Productos
            </Link>
            <Link to="/category" className="ms-1 nav-link">
              Categorías
            </Link>
            <Link to="/subcategory" className="ms-1 nav-link">
              Subcategorías
            </Link>
          </Nav>
          <Button onClick={handleLogout} variant="outline-primary">
            CERRAR SESIÓN
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
