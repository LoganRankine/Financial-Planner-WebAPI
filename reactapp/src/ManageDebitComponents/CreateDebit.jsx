import React, { Children, Component, useState } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import serverConfig from "../../server-config.json"

import { Button, Col, Form, InputGroup, Row, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { FormControl } from '../../node_modules/react-bootstrap/esm/index';

function CreateDebit() {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [directDebitName, setDirectDebitName] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [interval, setInterval] = useState("");
    const [intervalString, setIntervalString] = useState("");
    const [directDebitAmount, setDebitAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const cars = ['Ford', 'BMW', 'Audi', 'Vauxhaul', 'Renault', 'SEAT'];

    //get direct debits

    //Add direct debits
    const createDebit = (budgetId) => {

        //Create direct createDebit object using inputted values from user
        const createDebit = {
            BudgetId: budgetId,
            DebitName: directDebitName,
            DebitAmount: directDebitAmount,
            DebitDate: paymentDate,
            Frequency: interval
        }

        console.log("Add inputs to JSON object", createDebit)

        let sessionId = cookies.SessionID

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/DirectDebit/CreateDebit`,
            {
                method: 'POST', body: JSON.stringify(createDebit),
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => {
            if (response.status == 201) {
                setLoading(false)
                setDirectDebitName("")
                setDebitAmount("")
                setInterval("")
                setIntervalString("")
                setPaymentDate("")
                console.log("added direct createDebit successfully")
            }
            if (response.status == 400)
            {
                console.log("failed to add direct createDebit")
                setLoading(false)
            }
        })
    }

    const Column = (props) => {
        return (
            <div class="createDebit-detail-column">
                <div class="createDebit-column-left">
                    <a id="createDebit-name-title">{props.name}</a>
                    <a id="createDebit-due-title">due date</a>
                </div>
                <div class="createDebit-column-right">
                    <a id="createDebit-amount">due</a>
                    <span id="createDebit-action-button" class="material-symbols-outlined">
                        delete
                    </span>

                </div>
            </div>
        );
    }

    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(false);

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

            const budgetId = sessionStorage.getItem("BudgetId")
            const budgetStart = sessionStorage.getItem("BudgetStart")
            setPaymentDate(budgetStart)
            createDebit(budgetId)
        }

        setValidated(true);
    };


    return (
        <div className="centre-form">
            <Form.Text className="description-text">
                Welcome to the Direct Debit Form! To add a new direct debit, provide a <b>name</b> for easy reference. Select the payment <b>date</b>,
                choose how often it occurs, and enter the <b>amount</b> of the direct debit.
                This helps calculate the total cost of your direct debits within the budget period. Let's add your direct debit details!
            </Form.Text>
            <Form noValidate validated={validated} onSubmit={handleSubmit} className="centre-form" centred>
                <Row className="mb-3">
                    <Form.Group controlId="validationCustomUsername">
                        <Form.Label>Direct Debit Name</Form.Label>
                        <InputGroup hasValidation className="input-box">
                            <Form.Control
                                type="text"
                                onChange={(e) => setDirectDebitName(e.target.value)}
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please input a driect debit name.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Payment Date</Form.Label>
                        <InputGroup hasValidation className="input-box">
                            <Form.Control
                                type="datetime-local"
                                onChange={(e) => setPaymentDate(e.target.value)}
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please select a payment date.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group >
                        <Form.Label>Frequency</Form.Label>
                        <InputGroup hasValidation className="input-box">
                            <DropdownButton title={!intervalString ? "Frequency" : `${intervalString}: ${interval} days`} id="dropdown-autoclose-outside" autoClose="outside" className="enlarge-button">
                                <Dropdown.Item autoClose="inside" onClick={(e) => { setInterval(7); setIntervalString("Weekly")}}>Weekly</Dropdown.Item>
                                <Dropdown.Item autoClose="inside" onClick={(e) => { setInterval(14); setIntervalString("Bi-Weekly") }}>Bi-Weekly</Dropdown.Item>
                                <Dropdown.Item autoClose="inside" onClick={(e) => { setInterval(30); setIntervalString("Monthly") }}>Monthly</Dropdown.Item>
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
                    <Form.Group controlId="validationCustomUsername">
                        <Form.Label>Amount</Form.Label>
                        <InputGroup hasValidation className="input-box">
                            <Form.Control
                                type="number"
                                step="0.01"
                                onChange={(e) => setDebitAmount(e.target.value)}
                                placeholder="0000"
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please input an amount.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Row className="mb-3" >
                    <button className="update-button" type="submit">
                        {loading ? <>
                            <Spinner animation="border" variant="info" role="status" size="sm" />
                            <span> Adding Debit</span>
                        </> : 'Add direct debit'}
                    </button>
                </Row>
            </Form>
            <Form.Text muted>
                click <b>close</b>, if you do not want to add direct debits.
            </Form.Text>
        </div>
    );
}

export default CreateDebit