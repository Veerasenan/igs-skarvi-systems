import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { 
  faDatabase, 
  faUpload, 
  faTags, 
  faCalculator, 
  faChartPie, 
  faFileInvoiceDollar, 
  faPenToSquare, 
  faChartLine, 
  faClock 
} from '@fortawesome/free-solid-svg-icons'; // Import the icons you need

import "../components/EndOfDay.css"; // Import the custom CSS
import { useNavigate } from "react-router-dom";

const EndOfDay: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container className="end-of-day-container">

      <Row className="end-of-day-grid g-4">
        {/* Platts API Current Data */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="end-of-day-card">
            <Card.Body className="end-of-day-card-body">
              <FontAwesomeIcon icon={faDatabase} className="end-of-day-card-icon" />
              <h3 className="end-of-day-card-title">Platts API Current Data</h3>
              <p className="end-of-day-card-text">
                Access the current data from the Platts API
              </p>
              <Button className="end-of-day-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Upload Forward Curve - Heavy Products */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="end-of-day-card">
            <Card.Body className="end-of-day-card-body">
              <FontAwesomeIcon icon={faUpload} className="end-of-day-card-icon" />
              <h3 className="end-of-day-card-title">Upload Forward Curve - Heavy Products</h3>
              <p className="end-of-day-card-text">
                Upload the forward curve data for heavy products
              </p>
              <Button className="end-of-day-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Upload Forward Curve - Clean Products */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="end-of-day-card">
            <Card.Body className="end-of-day-card-body">
              <FontAwesomeIcon icon={faUpload} className="end-of-day-card-icon" />
              <h3 className="end-of-day-card-title">Upload Forward Curve - Clean Products</h3>
              <p className="end-of-day-card-text">
                Upload the forward curve data for clean products
              </p>
              <Button className="end-of-day-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Update Pricing Master */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="end-of-day-card">
            <Card.Body className="end-of-day-card-body">
              <FontAwesomeIcon icon={faTags} className="end-of-day-card-icon" />
              <h3 className="end-of-day-card-title">Update Pricing Master</h3>
              <p className="end-of-day-card-text">
                Update the pricing master with forward curve data
              </p>
              <Button className="end-of-day-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Update Physical Price Calculations */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="end-of-day-card">
            <Card.Body className="end-of-day-card-body">
              <FontAwesomeIcon icon={faCalculator} className="end-of-day-card-icon" />
              <h3 className="end-of-day-card-title">Update Physical Price Calculations</h3>
              <p className="end-of-day-card-text">
                Update physical price calculations based on new data
              </p>
              <Button className="end-of-day-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Update Paper Trade Price Calculations */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="end-of-day-card">
            <Card.Body className="end-of-day-card-body">
              <FontAwesomeIcon icon={faChartPie} className="end-of-day-card-icon" />
              <h3 className="end-of-day-card-title">Update Paper Trade Price Calculations</h3>
              <p className="end-of-day-card-text">
                Update paper trade price calculations based on new data
              </p>
              <Button className="end-of-day-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Update Inventory Valuation Report */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="end-of-day-card">
            <Card.Body className="end-of-day-card-body">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="end-of-day-card-icon" />
              <h3 className="end-of-day-card-title">Update Inventory Valuation Report</h3>
              <p className="end-of-day-card-text">
                Update inventory valuation report based on new data
              </p>
              <Button className="end-of-day-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Edit Prices */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="end-of-day-card">
            <Card.Body className="end-of-day-card-body">
              <FontAwesomeIcon icon={faPenToSquare} className="end-of-day-card-icon" />
              <h3 className="end-of-day-card-title">Edit Prices</h3>
              <p className="end-of-day-card-text">
                Edit prices based on new pricing data
              </p>
              <Button className="end-of-day-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Platts API Historical Data (Platts) */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="end-of-day-card">
            <Card.Body className="end-of-day-card-body">
              <FontAwesomeIcon icon={faChartLine} className="end-of-day-card-icon" />
              <h3 className="end-of-day-card-title">Platts API Historical Data (Platts)</h3>
              <p className="end-of-day-card-text">
                Access historical data from the Platts API
              </p>
              <Button className="end-of-day-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Platts API Historical Data (Futures) */}
        <Col xs={12} sm={6} md={4} lg={4}>
          <Card className="end-of-day-card">
            <Card.Body className="end-of-day-card-body">
              <FontAwesomeIcon icon={faClock} className="end-of-day-card-icon" />
              <h3 className="end-of-day-card-title">Platts API Historical Data (Futures)</h3>
              <p className="end-of-day-card-text">
                Access historical futures data from the Platts API
              </p>
              <Button className="end-of-day-launch-button" onClick={() => navigate("/Development")}>Launch</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EndOfDay;
