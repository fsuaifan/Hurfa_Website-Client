import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../css/logo.css';
import '../css/Navbar.css';

const LOGO_URL = "https://ik.imagekit.io/6dghafkgmq/tr:x-1648,y-950,w-677,h-753/001-Identity_Dark%20Green%20Logo.png?updatedAt=1777813390204";

function NavigationBar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // this checks if the dropdown menu is expanded or not
  const [expanded, setExpanded] = useState(false);
  // track scroll position to switch between transparent and solid
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // this function closes the dropdown menu when a link is clicked
  const closeDropdown = () => setExpanded(false);

  // Transparent only on the homepage when at the top and mobile menu is closed
  const isTransparent = isHomePage && !isScrolled && !expanded;

  return (
    <Navbar
      expand="lg"
      fixed="top"
      variant={isTransparent ? "dark" : "light"}
      expanded={expanded}
      onToggle={setExpanded}
      className={`hurfa-navbar ${isTransparent ? 'is-transparent' : 'is-solid shadow-sm'}`}
    >
      <Container className="d-flex align-items-center">
        {/* logo */}
        <Navbar.Brand as={Link} to="/" className="py-0 my-0 d-flex align-items-center">
          <img
            src={LOGO_URL}
            alt="Hurfa"
            className="nav-logo"
          />
        </Navbar.Brand>

        {/* dropdown menu toggle */}
        <Navbar.Toggle aria-controls="mobile-nav-dropdown" className="my-auto" />

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
              to={
                sessionStorage.getItem('hurfa_admin_authenticated') === 'true'
                  ? '/admin'
                  : sessionStorage.getItem('hurfa_customer_authenticated') === 'true'
                  ? '/account'
                  : '/login'
              }
              onClick={closeDropdown}
              className="py-2 px-3 fw-semibold text-uppercase small"
              style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}
            >
              Account
            </Nav.Link>

            <div className="py-2 py-lg-0 ps-lg-2">
              <button
                type="button"
                className={`btn btn-sm px-3 ${isTransparent ? 'btn-outline-light' : 'btn-outline-dark'}`}
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
