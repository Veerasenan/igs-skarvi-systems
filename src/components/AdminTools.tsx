import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// Import specific FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faCalendarPlus, faCalendar, faIdCard, faHistory, faDatabase, faTrash, faHeadset, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import "../components/AdminTools.css"; // Import the custom CSS
import { useNavigate } from "react-router-dom";

const AdminTools: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container className="admin-tools-container" style={{ marginTop: "30px" }}>
      

      <Row className="admin-tools-grid g-4">
        {/* Configure Data */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="admin-tools-card">
            <Card.Body className="admin-tools-card-body">
              <FontAwesomeIcon icon={faCogs} className="admin-tools-card-icon" />
              <h3 className="admin-tools-card-title">Configure Data</h3>
              <p className="admin-tools-card-text">
                Set up and configure data for the system
              </p>
              <Button className="admin-tools-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Add Holiday Schedules */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="admin-tools-card">
            <Card.Body className="admin-tools-card-body">
              <FontAwesomeIcon icon={faCalendarPlus} className="admin-tools-card-icon" />
              <h3 className="admin-tools-card-title">Add Holiday Schedules</h3>
              <p className="admin-tools-card-text">
                Add new holiday schedules to the system
              </p>
              <Button className="admin-tools-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Edit Holiday Schedules */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="admin-tools-card">
            <Card.Body className="admin-tools-card-body">
              <FontAwesomeIcon icon={faCalendar} className="admin-tools-card-icon" />
              <h3 className="admin-tools-card-title">Edit Holiday Schedules</h3>
              <p className="admin-tools-card-text">
                Modify existing holiday schedules
              </p>
              <Button className="admin-tools-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* KYC Documentation */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="admin-tools-card">
            <Card.Body className="admin-tools-card-body">
              <FontAwesomeIcon icon={faIdCard} className="admin-tools-card-icon" />
              <h3 className="admin-tools-card-title">KYC Documentation</h3>
              <p className="admin-tools-card-text">
                Manage KYC (Know Your Customer) documents
              </p>
              <Button className="admin-tools-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Audit Trail */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="admin-tools-card">
            <Card.Body className="admin-tools-card-body">
              <FontAwesomeIcon icon={faHistory} className="admin-tools-card-icon" />
              <h3 className="admin-tools-card-title">Audit Trail</h3>
              <p className="admin-tools-card-text">
                Access and view audit trail logs
              </p>
              <Button className="admin-tools-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Daily Data Back-up */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="admin-tools-card">
            <Card.Body className="admin-tools-card-body">
              <FontAwesomeIcon icon={faDatabase} className="admin-tools-card-icon" />
              <h3 className="admin-tools-card-title">Daily Data Back-up</h3>
              <p className="admin-tools-card-text">
                Backup system data on a daily basis
              </p>
              <Button className="admin-tools-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Delete Data */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="admin-tools-card">
            <Card.Body className="admin-tools-card-body">
              <FontAwesomeIcon icon={faTrash} className="admin-tools-card-icon" />
              <h3 className="admin-tools-card-title">Delete Data</h3>
              <p className="admin-tools-card-text">
                Delete unnecessary or outdated data
              </p>
              <Button className="admin-tools-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* HELP DESK Data */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="admin-tools-card">
            <Card.Body className="admin-tools-card-body">
              <FontAwesomeIcon icon={faHeadset} className="admin-tools-card-icon" />
              <h3 className="admin-tools-card-title">HELP DESK Data</h3>
              <p className="admin-tools-card-text">
                Access and manage help desk data
              </p>
              <Button className="admin-tools-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Other Modules */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="admin-tools-card">
            <Card.Body className="admin-tools-card-body">
              <FontAwesomeIcon icon={faCogs} className="admin-tools-card-icon" />
              <h3 className="admin-tools-card-title">Other Modules</h3>
              <p className="admin-tools-card-text">
                Access additional system modules
              </p>
              <Button className="admin-tools-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Ticket System */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="admin-tools-card">
            <Card.Body className="admin-tools-card-body">
              <FontAwesomeIcon icon={faTicketAlt} className="admin-tools-card-icon" />
              <h3 className="admin-tools-card-title">Ticket System</h3>
              <p className="admin-tools-card-text">
                Submit and manage tickets within the system
              </p>
              <Button className="admin-tools-launch-button" onClick={() => navigate ("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminTools;
