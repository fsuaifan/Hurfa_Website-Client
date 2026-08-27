import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";

const LOGO_URL = "https://ik.imagekit.io/6dghafkgmq/tr:x-1648,y-950,w-677,h-753/001-Identity_Dark%20Green%20Logo.png?updatedAt=1777813390204";

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto">
      <Container>
        {/* Top section: logo and media links */}
        <Row className="align-items-center justify-content-between pb-4 gy-3">
          {/* Logo */}
          <Col xs={12} md="auto" className="text-center text-md-start">
            <img
              src={LOGO_URL}
              alt="Hurfa"
              height="44"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Col>

          {/* Media links */}
          <Col xs={12} md="auto">
            <Nav className="justify-content-center justify-content-md-end gap-3 gap-md-4">
              <Nav.Link
                href="https://www.instagram.com/hurfa.h.d/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white-50 text-decoration-none px-0 link-light small text-uppercase"
                style={{ letterSpacing: "0.08em" }}
              >
                Instagram
              </Nav.Link>
              <Nav.Link
                href="https://www.facebook.com/profile.php?id=100088983976933"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white-50 text-decoration-none px-0 link-light small text-uppercase"
                style={{ letterSpacing: "0.08em" }}
              >
                Facebook
              </Nav.Link>
              <Nav.Link
                href="https://wa.me/+962797261602"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white-50 text-decoration-none px-0 link-light small text-uppercase"
                style={{ letterSpacing: "0.08em" }}
              >
                WhatsApp
              </Nav.Link>
            </Nav>
          </Col>
        </Row>

        {/* Bottom section: copyright and location */}
        <div className="border-top border-secondary pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center small text-white-50 gap-2">
          <span>© 2026 Hurfa LLC. All rights reserved.</span>
          <span>Amman, Jordan</span>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;