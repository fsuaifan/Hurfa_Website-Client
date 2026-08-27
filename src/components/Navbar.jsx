import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function NavigationBar() {
  // this checks if the dropdown menu is expanded or not
  const [expanded, setExpanded] = useState(false);
  // this function closes the dropdown menu when a link is clicked
  const closeDropdown = () => setExpanded(false);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      bg="white"
      expanded={expanded}
      onToggle={setExpanded}
      className="shadow-sm py-2 py-lg-3"
    >
      <Container>
        {/* logo */}
        <Navbar.Brand as={Link} to="/" className="py-0 d-flex align-items-center">
          <img
            src="https://ik.imagekit.io/6dghafkgmq/001-Identity_Dark%20Green%20Logo.png?updatedAt=1777813390204"
            alt="HurfaLogo"
            height="44"
          />
        </Navbar.Brand>

        {/* dropdown menu toggle */}
        <Navbar.Toggle aria-controls="mobile-nav-dropdown" />

        <Navbar.Collapse id="mobile-nav-dropdown">
          <Nav className="ms-auto align-items-lg-center text-center text-lg-start pt-3 pt-lg-0 border-top border-lg-0 mt-2 mt-lg-0 gap-lg-1">
            <Nav.Link
              as={NavLink}
              to="/kitchens"
              onClick={closeDropdown}
              className="py-2 px-3 fw-semibold text-uppercase small"
              style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}
            >
              Kitchens
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/bedrooms"
              onClick={closeDropdown}
              className="py-2 px-3 fw-semibold text-uppercase small"
              style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}
            >
              Bedrooms
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/products"
              onClick={closeDropdown}
              className="py-2 px-3 fw-semibold text-uppercase small"
              style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}
            >
              Products
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/about"
              onClick={closeDropdown}
              className="py-2 px-3 fw-semibold text-uppercase small"
              style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}
            >
              About
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin"
              onClick={closeDropdown}
              className="py-2 px-3 text-secondary text-uppercase small"
              style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}
            >
              Admin
            </Nav.Link>

            <div className="py-2 py-lg-0 ps-lg-2">
              <button
                type="button"
                className="btn btn-outline-dark btn-sm px-3"
                style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
                onClick={closeDropdown}
              >
                العربية
              </button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
