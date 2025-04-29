import React, { useState } from "react";
import { Container, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";

const API_URL = 'http://127.0.0.1:8000';

interface FormData {
    inventory: string;
    Quantity_mt: string;
    broker_name: string;
    bought_sold: string;
    fixed_price: string;
    broker_charges_unit: string;
    counterparty: string;
    pricing_period_from: string;
    broker_charges: string;
    group_name: string;
    traded_by: string;
    pricing_quotation: string;
    trade_created_on: string;
    quantitybbL: string;
    To: string;
    due_date: string;
    email_id: string;
}

const AddNewTrade: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        inventory: "",
        Quantity_mt: "",
        broker_name: "",
        bought_sold: "",
        fixed_price: "",
        broker_charges_unit: "",
        counterparty: "",
        pricing_period_from: "",
        broker_charges: "",
        group_name: "",
        traded_by: "",
        pricing_quotation: "",
        trade_created_on: "",
        quantitybbL: "",
        To: "",
        due_date: "",
        email_id: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
            if ((formData as any)[key] === "" && key !== 'id') {
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
        let accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        const isUpdate = !!formData.id;
        const url = isUpdate
            ? `${API_URL}/paper_trades/api/hedging/${formData.id}/`
            : `${API_URL}/paper_trades/api/hedging/`;
        console.log("formData", formData);
        console.log("accessToken", accessToken);
        const makeRequest = async (accessToken: string | null) => {
            return await fetch(url, {
                method: isUpdate ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
        };

        try {
            let response = await makeRequest(accessToken);
            if (response.status === 401 && refreshToken) {
                const refreshResponse = await fetch(`${API_URL}/api/token/refresh/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    accessToken = refreshData.access;
                    localStorage.setItem("access_token", accessToken);
                    response = await makeRequest(accessToken);
                } else {
                    // Handle refresh failure.  Important:  Clear tokens.
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    throw new Error("Session expired. Please log in again.");
                }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Failed to ${isUpdate ? 'update' : 'create'} trade`);
            }

            setSuccess(true);
            setFormData({
                inventory: "",
                Quantity_mt: "",
                broker_name: "",
                bought_sold: "",
                fixed_price: "",
                broker_charges_unit: "",
                counterparty: "",
                pricing_period_from: "",
                broker_charges: "",
                group_name: "",
                traded_by: "",
                pricing_quotation: "",
                trade_created_on: "",
                quantitybbL: "",
                To: "",
                due_date: "",
                email_id: ""
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
            position: 'relative',
            backgroundColor: '#f5f5f5',
        }}>
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
                    {formData.id ? 'Edit Trade' : 'Paper Transaction'}
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
                        Trade {formData.id ? 'updated' : 'created'} successfully!
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
                                    value={formData.Quantity_mt}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                />
                            </Form.Group>

                            <Form.Group controlId="brokerName" className="mt-3">
                                <Form.Label>Broker name</Form.Label>
                                <Form.Select name="brokerName" value={formData.broker_name} onChange={handleChange}>
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
                                <Form.Select name="boughtSold" value={formData.bought_sold} onChange={handleChange} required>
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
                                    value={formData.fixed_price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="brokerChargesUnit" className="mt-3">
                                <Form.Label>Broker Charges Unit</Form.Label>
                                <Form.Select name="brokerChargesUnit" value={formData.broker_charges_unit} onChange={handleChange}>
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
                                            value={formData.pricing_period_from}
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
                                    value={formData.broker_charges}
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
                                <Form.Select name="groupName" value={formData.group_name} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Group1">Group 1</option>
                                    <option value="Group2">Group 2</option>
                                </Form.Select>
                            </Form.Group>


                            <Form.Group controlId="tradedBy" className="mt-3">
                                <Form.Label>Traded By</Form.Label>
                                <Form.Select name="tradedBy" value={formData.traded_by} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Trader1">Trader 1</option>
                                    <option value="Trader2">Trader 2</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="pricingQuotation" className="mt-3">
                                <Form.Label>Pricing Quotation</Form.Label>
                                <Form.Select name="pricingQuotation" value={formData.pricing_quotation} onChange={handleChange}>
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
                                    value={formData.trade_created_on}
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
                                    value={formData.quantitybbL}
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
                                    value={formData.due_date}
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
                                    value={formData.email_id}
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
