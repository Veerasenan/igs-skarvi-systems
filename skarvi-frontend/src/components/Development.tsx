import React from "react";
import { Container, Spinner } from "react-bootstrap";
import "./Development.css"; // Create this CSS file for styling

const Development: React.FC = () => {
  return (
    <Container className="development-container">
      <div className="development-content">
        <h2>🚧 Development In Progress 🚧</h2>
        <Spinner animation="border" variant="primary" className="loading-spinner" />
        <p className="development-text">
          We are working hard to bring you new features. Stay tuned for updates!
        </p>
      </div>
      <footer className="development-footer">
        ⚡ This page is under construction. Please check back later. ⚡
      </footer>
    </Container>
  );
};

export default Development;
