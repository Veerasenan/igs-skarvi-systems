import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Breadcrumb } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../components/Papertrades.css"; // Ensure styles are applied correctly
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faCopy, faExchangeAlt, faCheckCircle, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

const Papertrades: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container className="cards-container" style={{ marginTop: "-12px" }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item  active>Trades</Breadcrumb.Item> {/* Link to Trades */}
        <Breadcrumb.Item href="/paper-trades">Paper Trades</Breadcrumb.Item> {/* Current Page */}
      </Breadcrumb>
      <Row className="cards-grid g-4">
        {/* Add New Trades and Create a Physical Entry */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="card-custom">
            <Card.Body>
              <FontAwesomeIcon icon={faCirclePlus} className="card-icon" />
              <h3 className="card-title">Add New Trades and Create a Physical Entry</h3>
              <p className="card-text">Create a new trade entry for physical trades.</p>
              <Button 
                className="launch-button"
                onClick={() => navigate("/add-new-trade")} // Changed from "/Development"
              >
                Launch
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Edit Heavy Product Trades */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="card-custom">
            <Card.Body>
              <FontAwesomeIcon icon={faPenToSquare} className="card-icon" />
              <h3 className="card-title">Edit Heavy Product Trades</h3>
              <p className="card-text">Modify trade details for heavy products.</p>
              <Button className="launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Edit Clean Product Trades */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="card-custom">
            <Card.Body>
              <FontAwesomeIcon icon={faPenToSquare} className="card-icon" />
              <h3 className="card-title">Edit Clean Product Trades</h3>
              <p className="card-text">Modify trade details for clean products entries.</p>
              <Button className="launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Copy an Existing Trade for New Entry */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="card-custom">
            <Card.Body>
              <FontAwesomeIcon icon={faCopy} className="card-icon" />
              <h3 className="card-title">Copy an Existing Trade for New Entry</h3>
              <p className="card-text">Copy an existing trade to make a new entry.</p>
              <Button className="launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Integrate ICE Trades for Effective Data Management */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="card-custom">
            <Card.Body>
              <FontAwesomeIcon icon={faExchangeAlt} className="card-icon" />
              <h3 className="card-title">Integrate ICE Trades for Effective Data Management</h3>
              <p className="card-text">Integrate ICE trade data for smooth management.</p>
              <Button className="launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Validate ICE Trades for Clean Products and Entries */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="card-custom">
            <Card.Body>
              <FontAwesomeIcon icon={faCheckCircle} className="card-icon" />
              <h3 className="card-title">Validate ICE Trades for Clean Products and Entries</h3>
              <p className="card-text">Validate clean product trades for accurate records.</p>
              <Button className="launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Validate ICE Trades for Heavy Products and Entries */}
        <Col xs={12} sm={6} md={4} lg={4}> 
        
          <Card className="card-custom">
            <Card.Body>
              <FontAwesomeIcon icon={faClipboardCheck} className="card-icon" />
              <h3 className="card-title">Validate ICE Trades for Heavy Products and Entries</h3>
              <p className="card-text">Validate heavy product trades for accurate records.</p>
              <Button className="launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Papertrades;
