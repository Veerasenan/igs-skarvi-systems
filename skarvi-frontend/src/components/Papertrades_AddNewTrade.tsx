import React, { useState } from "react";
import { Container, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";

const API_URL = 'http://127.0.0.1:8000';

interface FormData {
  inventory: string;
  quantityMT: string;
  brokerName: string;
  boughtSold: string;
  fixedPrice: string;
  brokerChargesUnit: string;
  counterparty: string;
  pricingPeriodFrom: string;
  brokerCharges: string;
  groupName: string;
  tradedBy: string;
  pricingQuotation: string;
  tradeCreatedOn: string;
  quantityBBL: string;
  To: string;
  dueDate: string;
  emailID: string;
}

const AddNewTrade: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    inventory: "",
    quantityMT: "",
    brokerName: "",
    boughtSold: "",
    fixedPrice: "",
    brokerChargesUnit: "",
    counterparty: "",
    pricingPeriodFrom: "",
    brokerCharges: "",
    groupName: "",
    tradedBy: "",
    pricingQuotation: "",
    tradeCreatedOn: "",
    quantityBBL: "",
    To: "",
    dueDate: "",
    emailID: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getCSRFToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))?.split('=')[1] || '';
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    for (let key in formData) {
      if ((formData as any)[key] === "") {
        return "Please fill in all required fields.";
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    const csrfToken = getCSRFToken();

    try {
      const response = await fetch(`${API_URL}/api/hedging/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          quantity: formData.quantityBBL,
          quantity_mt: formData.quantityMT,
          stop_loss_limit: '',
          settlementValue: '',
          floatingPrice: ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create trade');
      }

      setSuccess(true);
      setFormData({
        inventory: "",
        quantityMT: "",
        brokerName: "",
        boughtSold: "",
        fixedPrice: "",
        brokerChargesUnit: "",
        counterparty: "",
        pricingPeriodFrom: "",
        brokerCharges: "",
        groupName: "",
        tradedBy: "",
        pricingQuotation: "",
        tradeCreatedOn: "",
        quantityBBL: "",
        To: "",
        dueDate: "",
        emailID: ""
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: 'auto',
      // overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#f5f5f5',
    }}>
      {/* Header with colored rectangle */}
      <div style={{
        backgroundColor: '#e9ecef',
        padding: '20px 0',
        marginBottom: '40px',
        boxShadow: '0 4px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2c3e50',
          fontWeight: 'bold',
          margin: 0
        }}>
          Paper Transaction
        </h2>
      </div>

      <Container style={{ 
        flex: 1,
        padding: '0 15px 70px',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {/* Success/Error Alerts */}
        {success && (
          <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
            Trade created successfully!
          </Alert>
        )}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {/* Form Content */}
        <Form onSubmit={handleSubmit} style={{ padding: '0 15px' }}>
          <Row>
            {/* Column 1 */}
            <Col md={3}>
              <Form.Group controlId="inventory">
                <Form.Label>Transaction Reference</Form.Label>
                <Form.Select name="inventory" value={formData.inventory} onChange={handleChange} required>
                  <option value="">Inventory</option>
                  <option value="Inventory1">Inventory 1</option>
                  <option value="Inventory2">Inventory 2</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="quantityMT" className="mt-3">
                <Form.Label>Quantity MT</Form.Label>
                <Form.Control 
                  type="number" 
                  name="quantityMT" 
                  value={formData.quantityMT} 
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </Form.Group>

              <Form.Group controlId="brokerName" className="mt-3">
                <Form.Label>Broker name</Form.Label>
                <Form.Select name="brokerName" value={formData.brokerName} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Broker1">Broker 1</option>
                  <option value="Broker2">Broker 2</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Column 2 */}
            <Col md={3}>
              <Form.Group controlId="boughtSold">
                <Form.Label>Bought/Sold</Form.Label>
                <Form.Select name="boughtSold" value={formData.boughtSold} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Bought">Bought</option>
                  <option value="Sold">Sold</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="fixedPrice" className="mt-3">
                <Form.Label>Fixed Price</Form.Label>
                <Form.Control 
                  type="number" 
                  name="fixedPrice" 
                  value={formData.fixedPrice} 
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>

              <Form.Group controlId="brokerChargesUnit" className="mt-3">
                <Form.Label>Broker Charges Unit</Form.Label>
                <Form.Select name="brokerChargesUnit" value={formData.brokerChargesUnit} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Column 3 */}
            <Col md={3}>
  <Form.Group controlId="counterparty">
    <Form.Label>Counterparty</Form.Label>
    <Form.Control 
      type="text" 
      name="counterparty" 
      value={formData.counterparty} 
      onChange={handleChange} 
       
    />
  </Form.Group>

  <Form.Group controlId="pricingPeriodFrom" className="mt-3">
    {/* <Form.Label>Pricing Period</Form.Label> */}
    <div className="d-flex">
      <div className="flex-grow-1 me-2">
        <Form.Label >Pricing Period From</Form.Label>
        <Form.Control 
          type="date" 
          name="pricingPeriodFrom" 
          value={formData.pricingPeriodFrom} 
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex-grow-1">
        <Form.Label >To</Form.Label>
        <Form.Control 
          type="date" 
          name="To" 
          value={formData.To} 
          onChange={handleChange}
          required
        />
      </div>
    </div>
  </Form.Group>

  <Form.Group controlId="brokerCharges" className="mt-3">
    <Form.Label>Broker Charges</Form.Label>
    <Form.Control 
      type="number" 
      name="brokerCharges" 
      value={formData.brokerCharges} 
      onChange={handleChange}
      min="0"
      step="0.01"
    />
  </Form.Group>
</Col>

            {/* Column 4 */}
            <Col md={3}>
              <Form.Group controlId="groupName">
                <Form.Label>Group Name</Form.Label>
                <Form.Select name="groupName" value={formData.groupName} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Group1">Group 1</option>
                  <option value="Group2">Group 2</option>
                </Form.Select>
              </Form.Group>
              

              <Form.Group controlId="tradedBy" className="mt-3">
                <Form.Label>Traded By</Form.Label>
                <Form.Select name="tradedBy" value={formData.tradedBy} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Trader1">Trader 1</option>
                  <option value="Trader2">Trader 2</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="pricingQuotation" className="mt-3">
                <Form.Label>Pricing Quotation</Form.Label>
                <Form.Select name="pricingQuotation" value={formData.pricingQuotation} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Quote1">Quote 1</option>
                  <option value="Quote2">Quote 2</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Second Row */}
          <Row>
            <Col md={3}>
              <Form.Group controlId="tradeCreatedOn" className="mt-3">
                <Form.Label>Trade Created on</Form.Label>
                <Form.Control 
                  type="date" 
                  name="tradeCreatedOn" 
                  value={formData.tradeCreatedOn} 
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="quantityBBL" className="mt-3">
                <Form.Label>Quantity BBL</Form.Label>
                <Form.Control 
                  type="number" 
                  name="quantityBBL" 
                  value={formData.quantityBBL} 
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="dueDate" className="mt-3">
                <Form.Label>Due date (in days)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="dueDate" 
                  value={formData.dueDate} 
                  onChange={handleChange}
                  min="0"
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="emailID" className="mt-3">
                <Form.Label>Email ID</Form.Label>
                <Form.Control 
                  type="email" 
                  name="emailID" 
                  value={formData.emailID} 
                  onChange={handleChange} 
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
              style={{ minWidth: '150px' }}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Submitting...
                </>
              ) : 'Submit'}
            </Button>
          </div>
        </Form>
      </Container>

      {/* Fixed Footer with space at bottom */}
      <footer style={{
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: '#e9ecef',
    padding: '20px 0',
    textAlign: 'center',
    borderTop: '2px solid #dee2e6',
    zIndex: 1000
  }}>
    <p className="text-muted mb-0">Copyright © 2024 by Skarvi Systems</p>
  </footer>
    </div>
  );
};

export default AddNewTrade;