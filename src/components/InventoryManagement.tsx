import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse, faClipboardList, faChartLine, faBoxesStacked } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import "../components/InventoryManagement.css"; // Import custom CSS
import { useNavigate } from "react-router-dom";

const InventoryManagement: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container className="inventory-container" style={{ marginTop: "30px" }}>

      <Row className="inventory-grid g-4">
        {/* Configure Inventory Tanks */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="inventory-card">
            <Card.Body className="inventory-card-body">
              <FontAwesomeIcon icon={faWarehouse} className="inventory-card-icon" />
              <h3 className="inventory-card-title">Configure Inventory Tanks</h3>
              <p className="inventory-card-text">
                Manage inventory tanks configuration
              </p>
              <Button className="inventory-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* View Inventory Tanks Report */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="inventory-card">
            <Card.Body className="inventory-card-body">
              <FontAwesomeIcon icon={faClipboardList} className="inventory-card-icon" />
              <h3 className="inventory-card-title">View Inventory Tanks Report</h3>
              <p className="inventory-card-text">
                View the current inventory tanks report
              </p>
              <Button className="inventory-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Configure Inventory Valuation */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="inventory-card">
            <Card.Body className="inventory-card-body">
              <FontAwesomeIcon icon={faChartLine} className="inventory-card-icon" />
              <h3 className="inventory-card-title">Configure Inventory Valuation</h3>
              <p className="inventory-card-text">
                Update the inventory valuation settings
              </p>
              <Button className="inventory-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Inventory Quantities Report */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="inventory-card">
            <Card.Body className="inventory-card-body">
              <FontAwesomeIcon icon={faBoxesStacked} className="inventory-card-icon" />
              <h3 className="inventory-card-title">Inventory Quantities Report</h3>
              <p className="inventory-card-text">
                View the inventory quantities report
              </p>
              <Button className="inventory-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InventoryManagement;
