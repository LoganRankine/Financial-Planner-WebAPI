import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

import { Modal, Form, InputGroup, Row, Button, Col, Container, Toast, ToastContainer } from 'react-bootstrap';
import serverConfig from "../../server-config.json"

function EditBudget({ showEdit, setShowEdit, budget }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [budgetName, setBudgetName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budgetAmount, setBudgetAmount] = useState("");

    const [deleteStatus, setDeleteStatus] = useState(false);
    const [deleteStatusText, setDeleteStatusText] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleDeleteStatus = () => setDeleteStatus(!deleteStatus);

    const handleCloseEdit = () => setShowEdit(false);
    const handleEdit = () => setShowEdit(true);

    const editBudgetItem = () => {
        const budgetId = budget.BudgetId

        const editBudget = {
            BudgetId: budgetId,
            BudgetName: budgetName,
            BudgetAmount: budgetAmount,
            StartDate: startDate,
            EndDate: endDate,
        }
        console.log("Add inputs to JSON object", editBudget)

        //Send data to create budget
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)
        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/EditBudget`,
            {
                method: 'PUT', body: JSON.stringify(editBudget),
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => {
            if (response.status == 201) {

                response.json().then(data => {
                    setDeleteStatus(true)
                    setDeleteStatusText(data.Description)
                    setIsSuccess(true)
                    setShowEdit(false)
                    console.log("added direct budget successfully")
                })
            }
        })
    }

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (form.checkValidity() === true) {
            event.preventDefault();
            event.stopPropagation();
            editBudgetItem()
        }

        setValidated(true);
    };

    return (
        <div>
            <Modal show={showEdit} onHide={handleCloseEdit} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Edit <b>{budget.ItemName}</b> Information</Modal.Title>
                </Modal.Header>
                <Modal.Body className="centre-form">
                    <Form noValidate validated={validated} onSubmit={handleSubmit} className="centre-form">
                        <Row className="mb-3">
                            <Form.Group md="4">
                                <Form.Label>Budget Name</Form.Label><br />
                                <Form.Control type="text" value={budgetName}
                                    onChange={(e) => setBudgetName(e.target.value)}
                                    placeholder={budget.BudgetName}
                                    className="input-box"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Start Date</Form.Label><br />
                                <Form.Control type="datetime-local" value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    onFocus={(e) => (e.target.type = "date")}
                                    placeholder={budget.StartDate}
                                    className="input-box" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group className="input-container">
                                <Form.Label>End Date</Form.Label><br />
                                <Form.Control type="datetime-local" value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    onFocus={(e) => (e.target.type = "date")}
                                    placeholder={budget.EndDate}
                                    className="input-box" />
                            </Form.Group>
                            <Form.Group className="input-container">
                                <Form.Label>Total Budget Amount</Form.Label><br />
                                <Form.Control type="number" value={budgetAmount}
                                    onChange={(e) => setBudgetAmount(e.target.value)}
                                    placeholder={budget.BudgetAmount}
                                    className="input-box" />
                            </Form.Group>
                        </Row>
                        <Row>
                            <button className="update-button" variant="success" type="submit">Update</button>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit} >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-center" >
                <Toast show={deleteStatus} onClose={toggleDeleteStatus} animation={true} bg={isSuccess ? "success" : "warning"} delay={5000} autohide>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">{!isSuccess ? "Error occured" : `${budget.BudgetName} updated`}</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body>{deleteStatusText}</Toast.Body>
                </Toast>
            </ToastContainer>

        </div>
    );
}

export default EditBudget