import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip, faHandHoldingUsd, faPiggyBank, faFileInvoice, faCalendarCheck, faTasks, faFileAlt, faFolderOpen, faChartLine, faBoxOpen } from '@fortawesome/free-solid-svg-icons'; // Import the specific icons
import "../components/OperationsAndLogistics.css";
import { useNavigate } from "react-router-dom";

const OperationsAndLogistics: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container className="operations-logistics-container" style={{ marginTop: "30px" }}>

      <Row className="operations-logistics-grid g-4">
        {/* Automated Cargo/Vessel Operations Cargoes */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="operations-logistics-card">
            <Card.Body className="operations-logistics-card-body">
              <FontAwesomeIcon icon={faShip} className="operations-logistics-card-icon" />
              <h3 className="operations-logistics-card-title">Automated Cargo/Vessel Operations Cargoes</h3>
              <p className="operations-logistics-card-text">Manage cargo and vessel operations with automated tools</p>
              <Button className="operations-logistics-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Automated Trade Finance Operations */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="operations-logistics-card">
            <Card.Body className="operations-logistics-card-body">
              <FontAwesomeIcon icon={faHandHoldingUsd} className="operations-logistics-card-icon" />
              <h3 className="operations-logistics-card-title">Automated Trade Finance Operations</h3>
              <p className="operations-logistics-card-text">Streamline and automate trade finance operations for improved efficiency</p>
              <Button className="operations-logistics-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Treasury */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="operations-logistics-card">
            <Card.Body className="operations-logistics-card-body">
              <FontAwesomeIcon icon={faPiggyBank} className="operations-logistics-card-icon" />
              <h3 className="operations-logistics-card-title">Treasury</h3>
              <p className="operations-logistics-card-text">Streamline and efficiently manage your financial resources and operations</p>
              <Button className="operations-logistics-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Inspection Costs Invoicing */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="operations-logistics-card">
            <Card.Body className="operations-logistics-card-body">
              <FontAwesomeIcon icon={faFileInvoice} className="operations-logistics-card-icon" />
              <h3 className="operations-logistics-card-title">Inspection Costs Invoicing</h3>
              <p className="operations-logistics-card-text">Easily manage inspection-related costs and invoicing details</p>
              <Button className="operations-logistics-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Key Dates Reminder Email */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="operations-logistics-card">
            <Card.Body className="operations-logistics-card-body">
              <FontAwesomeIcon icon={faCalendarCheck} className="operations-logistics-card-icon" />
              <h3 className="operations-logistics-card-title">Key Dates Reminder Email</h3>
              <p className="operations-logistics-card-text">Receive email reminders for important key dates</p>
              <Button className="operations-logistics-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Status Of Operations */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="operations-logistics-card">
            <Card.Body className="operations-logistics-card-body">
              <FontAwesomeIcon icon={faTasks} className="operations-logistics-card-icon" />
              <h3 className="operations-logistics-card-title">Status Of Operations</h3>
              <p className="operations-logistics-card-text">Track and monitor the status of ongoing operations</p>
              <Button className="operations-logistics-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Statement of Costs */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="operations-logistics-card">
            <Card.Body className="operations-logistics-card-body">
              <FontAwesomeIcon icon={faFileAlt} className="operations-logistics-card-icon" />
              <h3 className="operations-logistics-card-title">Statement of Costs</h3>
              <p className="operations-logistics-card-text">View detailed statements of costs for operations and services</p>
              <Button className="operations-logistics-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* E-File Documents */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="operations-logistics-card">
            <Card.Body className="operations-logistics-card-body">
              <FontAwesomeIcon icon={faFolderOpen} className="operations-logistics-card-icon" />
              <h3 className="operations-logistics-card-title">E-File Documents</h3>
              <p className="operations-logistics-card-text">Digitally manage and securely store and organize documents</p>
              <Button className="operations-logistics-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Automated Cargo/Vessel Operations Trading Cargoes */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="operations-logistics-card">
            <Card.Body className="operations-logistics-card-body">
              <FontAwesomeIcon icon={faChartLine} className="operations-logistics-card-icon" />
              <h3 className="operations-logistics-card-title">Automated Cargo/Vessel Operations Trading Cargoes</h3>
              <p className="operations-logistics-card-text">Automate cargo trading operations</p>
              <Button className="operations-logistics-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Automated Cargo/Vessel Operations Cargoes Sold */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="operations-logistics-card">
            <Card.Body className="operations-logistics-card-body">
              <FontAwesomeIcon icon={faBoxOpen} className="operations-logistics-card-icon" />
              <h3 className="operations-logistics-card-title">Automated Cargo/Vessel Operations Cargoes Sold</h3>
              <p className="operations-logistics-card-text">Manage and track sold cargo operations easily</p>
              <Button className="operations-logistics-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OperationsAndLogistics;
