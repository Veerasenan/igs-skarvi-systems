import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faSnowflake, faFileAlt, faBrain } from '@fortawesome/free-solid-svg-icons';
import "../components/Reports.css"; // Import the custom CSS
import { useNavigate } from "react-router-dom";


const Reports: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container className="reports-container">

      <Row className="reports-grid g-4">
        {/* Report - Heavy Products */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="reports-card">
            <Card.Body className="reports-card-body">
              <FontAwesomeIcon icon={faCogs} className="reports-card-icon" />
              <h3 className="reports-card-title">Report - Heavy Products</h3>
              <p className="reports-card-text">View detailed reports for heavy products</p>
              <Button className="reports-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Report - Clean Products */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="reports-card">
            <Card.Body className="reports-card-body">
              <FontAwesomeIcon icon={faSnowflake} className="reports-card-icon" />
              <h3 className="reports-card-title">Report - Clean Products</h3>
              <p className="reports-card-text">View detailed reports for clean products</p>
              <Button className="reports-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Other Reports */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="reports-card">
            <Card.Body className="reports-card-body">
              <FontAwesomeIcon icon={faFileAlt} className="reports-card-icon" />
              <h3 className="reports-card-title">Other Reports</h3>
              <p className="reports-card-text">Access other reports and analytics</p>
              <Button className="reports-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Core Intelligence Analytics */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="reports-card">
            <Card.Body className="reports-card-body">
              <FontAwesomeIcon icon={faBrain} className="reports-card-icon" />
              <h3 className="reports-card-title">Core Intelligence Analytics</h3>
              <p className="reports-card-text">Analyze core intelligence</p>
              <Button className="reports-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
