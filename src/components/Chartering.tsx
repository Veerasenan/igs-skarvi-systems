import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip, faPenToSquare, faChartLine, faAnchor } from '@fortawesome/free-solid-svg-icons';
import "../components/Chartering.css"; // Import the updated CSS
import { useNavigate } from "react-router-dom";


const Chartering: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container className="chartering-container" style={{ marginTop: "30px" }}>
      

      <Row className="chartering-grid g-4">
        {/* Add Charter Party */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="chartering-card">
            <Card.Body className="chartering-card-body">
              <FontAwesomeIcon icon={faShip} className="chartering-card-icon" />
              <h3 className="chartering-card-title">Add Charter Party</h3>
              <p className="chartering-card-text">Create a new charter party entry</p>
              <Button className="chartering-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Edit Charter Party */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="chartering-card">
            <Card.Body className="chartering-card-body">
              <FontAwesomeIcon icon={faPenToSquare} className="chartering-card-icon" />
              <h3 className="chartering-card-title">Edit Charter Party</h3>
              <p className="chartering-card-text">Modify existing charter party details</p>
              <Button className="chartering-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Chartering Monitor */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="chartering-card">
            <Card.Body className="chartering-card-body">
              <FontAwesomeIcon icon={faChartLine} className="chartering-card-icon" />
              <h3 className="chartering-card-title">Chartering Monitor</h3>
              <p className="chartering-card-text">Monitor and forecast charter party data</p>
              <Button className="chartering-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Vessel Nomination */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="chartering-card">
            <Card.Body className="chartering-card-body">
              <FontAwesomeIcon icon={faAnchor} className="chartering-card-icon" />
              <h3 className="chartering-card-title">Vessel Nomination</h3>
              <p className="chartering-card-text">Nominate vessels for chartering purposes</p>
              <Button className="chartering-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Chartering;
