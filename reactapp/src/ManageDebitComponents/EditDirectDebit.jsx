import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

import { Modal, Button, Toast, ToastContainer, Form, Row, Spinner, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap';
import serverConfig from "../../server-config.json"

function EditDirectForm({ showEdit, setShowEdit, debit, _refresh }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [directDebitName, setDirectDebitName] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [interval, setInterval] = useState("");
    const [intervalString, setIntervalString] = useState("");
    const [directDebitAmount, setDebitAmount] = useState(null);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

    const [deleteStatus, setDeleteStatus] = useState(false);
    const [deleteStatusText, setDeleteStatusText] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleDeleteStatus = () => setDeleteStatus(!deleteStatus);

    const setDefaultValues = () => {
        setDirectDebitName(debit.DebitName)
        setDebitAmount(debit.DebitAmount)
        setPaymentDate(debit.DebitDate)
        setInterval(debit.Frequency)
    }

    useEffect(() => {
        setDefaultValues()
    }, [])

    const handleCloseEdit = () => setShowEdit(false);
    const handleEdit = () => setShowEdit(true);
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
            edit()
        }

        setValidated(true);
    };


    const edit = (event) => {
        const budgetId = debit.BudgetId

        const editDebit = {
            BudgetId: budgetId,
            DebitId: debit.DebitId,
            DebitName: directDebitName,
            DebitAmount: directDebitAmount,
            DebitDate: paymentDate,
            Frequency: interval
        }
        console.log("Add inputs to JSON object", editDebit)

        //Send data to create budget
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)
        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/DirectDebit/EditDirectDebit`,
            {
                method: 'PUT', body: JSON.stringify(editDebit),
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => {
            if (response.status == 201) {

                response.json().then(data => {
                    setDeleteStatus(true)
                    setDeleteStatusText(data.SuccessDescription)
                    setIsSuccess(true)
                    setShowEdit(false)
                    console.log("added direct budgetItem successfully")
                    _refresh()
                })
            }
        })

    }

    //Add direct debits

    return (
        <div>
            <Modal show={showEdit} onHide={handleCloseEdit} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Edit <b>{debit.DebitName}</b> Information</Modal.Title>
                </Modal.Header>
                <Modal.Body className="centre-form">
                    <Form.Text className="description-text">
                        You can make changes to your direct debit details
                        by updating only the information you need. If you want to edit the debit <b>name</b>, payment <b>date</b>, 
                        <b>Frequency</b>, or <b>amount</b>, simply fill in the respective field. <b>No need to fill out everything, just update what you want</b>.
                    </Form.Text>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} className="centre-form">
                        <Row className="mb-3">
                            <Form.Group className="input-container">
                                <Form.Label>Direct Debit Name</Form.Label><br />
                                <Form.Control type="text" value={directDebitName}
                                    onChange={(e) => setDirectDebitName(e.target.value)}
                                    className="input-box"
                                    placeholder={debit.DebitName}
                                />
                            </Form.Group>
                            <Form.Group className="input-container">
                                <Form.Label>Payment Date</Form.Label><br />
                                <Form.Control type="date" value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    className="input-box"
                                    placeholder={debit.DebitDate}
                                />
                            </Form.Group>
                            <Form.Group className="input-container">
                                <Form.Label>Frequency</Form.Label>
                                <InputGroup hasValidation className="input-box">
                                    <DropdownButton title={!intervalString ? "Frequency" : `${intervalString}: ${interval} days`} id="dropdown-autoclose-outside" autoClose="outside" className="enlarge-button">
                                        <Dropdown.Item onClick={(e) => { setInterval(7); setIntervalString("Weekly") }}>Weekly</Dropdown.Item>
                                        <Dropdown.Item onClick={(e) => { setInterval(14); setIntervalString("Bi-Weekly") }}>Bi-Weekly</Dropdown.Item>
                                        <Dropdown.Item onClick={(e) => { setInterval(30); setIntervalString("Monthly") }}>Monthly</Dropdown.Item>
                                        <Dropdown.Item>
                                            <Form.Label>Custom value</Form.Label>
                                            <Form.Control
                                                value={`${interval}`}
                                                type="number"
                                                step="0.02"
                                                onChange={(e) => { setInterval(e.target.value); setIntervalString("Custom") }}
                                                aria-describedby="inputGroupPrepend"
                                                placeholder="Custom value"
                                                required>
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                Please input an interval.
                                            </Form.Control.Feedback>
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="input-container">
                                <Form.Label>Amount</Form.Label><br />
                                <Form.Control type="number" value={directDebitAmount}
                                    onChange={(e) => setDebitAmount(e.target.value)}
                                    className="input-box"
                                    placeholder={debit.DebitAmount}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <button className="update-button" type="submit">
                                {loading ? <>
                                    <Spinner animation="border" variant="info" role="status" size="sm" />
                                    <span> Updating Debit</span>
                                </> : 'Update Debit'}
                            </button>
                        </Row>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {/*<Button variant="success" onClick={edit}>*/}
                    {/*    Update*/}
                    {/*</Button>*/}
                    <Button variant="secondary" onClick={handleCloseEdit} >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-center" >
                <Toast show={deleteStatus} onClose={toggleDeleteStatus} animation={true} bg={isSuccess ? "success" : "warning"} delay={3000} autohide>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">{!debit.debitName ? "Error occured" : `${debit.debitName} updated`}</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body>{deleteStatusText}</Toast.Body>
                </Toast>
            </ToastContainer>

        </div>
    );
}

export default EditDirectForm