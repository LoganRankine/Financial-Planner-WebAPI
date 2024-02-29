import React, { Children, Component, useState } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import Alert from 'react-bootstrap/Alert';

import { Modal, Button, Toast, ToastContainer, Form, Spinner, Row } from 'react-bootstrap';
import serverConfig from "../../server-config.json"

function PurchaseForm({ budget_id, show, setShow, refresh }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [itemName, setItemName] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [itemAmount, setItemAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleClose = () => setShow(false);

    const addPurchase = () => {
        setLoading(true)
        const createPurchase = {
            BudgetId: budget_id,
            ItemName: itemName,
            ItemAmount: itemAmount,
            PurchaseDate: purchaseDate,
        }
        console.log("Add inputs to JSON object", createPurchase)

        //Send data to create budget
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/CreateBudgetItem`,
            {
                method: 'POST', body: JSON.stringify(createPurchase),
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => {
            //Created successfully
            if (response.status == 201) {
                response.json().then(data => {
                    setLoading(false)
                    refresh()
                    try {
                        //Get BudgetId from response
                        const BudgetItemObject = JSON.parse(data)
                        console.log(BudgetItemObject)
                        handleClose()
                    }
                    catch (err) {
                        console.error(err)
                    }
                })
            }
            setLoading(false)
        })
    }

    const handleSubmit = async (event) => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (form.checkValidity() === true) {
            setLoading(true)
            event.preventDefault();
            event.stopPropagation();

            addPurchase()
        }

        setValidated(true);
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Add Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body className="centre-form">
                    <Form.Text className="description-text">
                        Welcome to the Purchase Form! To add a new purchase to your budget, provide a <b>name</b> for your purchase,
                        select the payment <b>date</b>, and enter the <b>amount</b>. This helps you keep track of your expenses within your budget.
                        Let's get started!
                    </Form.Text>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} className="centre-form" centred>
                        <Row className="mb-3">
                            <Form.Group class="input-container">
                                <Form.Label>Purchase Name</Form.Label><br />
                                <Form.Control type="text" value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    class="input-box" required/>
                                <Form.Control.Feedback type="invalid">
                                    Please input a purchase name.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group class="input-container">
                                <Form.Label>Purchase Date</Form.Label><br />
                                <Form.Control type="datetime-local" value={purchaseDate}
                                    onChange={(e) => setPurchaseDate(e.target.value)}
                                    class="input-box" required />
                                <Form.Control.Feedback type="invalid">
                                    Please input a purchase date.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group class="input-container">
                                <Form.Label>Purchase Amount</Form.Label><br />
                                <Form.Control type="number" value={itemAmount}
                                    step="0.01"
                                    onChange={(e) => setItemAmount(e.target.value)}
                                    class="input-box" />
                            </Form.Group>
                            <Form.Control.Feedback type="invalid">
                                Please input a purchase amount.
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="mb-3">
                            <button className="update-button" type="submit">
                                {loading ? <>
                                    <Spinner animation="border" variant="info" role="status" size="sm" />
                                    <span> Adding Purchase</span>
                                </> : 'Add Purchase'}
                            </button>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default PurchaseForm