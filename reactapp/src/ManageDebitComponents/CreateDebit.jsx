import React, { Children, Component, useState } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import serverConfig from "../../server-config.json"

import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';

function CreateDebit() {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [directDebitName, setDirectDebitName] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [interval, setInterval] = useState("");
    const [directDebitAmount, setDebitAmount] = useState("");

    const cars = ['Ford', 'BMW', 'Audi', 'Vauxhaul', 'Renault', 'SEAT'];

    //get direct debits

    //Add direct debits
    const saveDebit = async (event) => {
        const budgetId = sessionStorage.getItem("BudgetId")

        const createDebit = {
            BudgetId: budgetId,
            DebitName: directDebitName,
            DebitAmount: directDebitAmount,
            DebitDate: paymentDate,
            Frequency: interval
        }
        console.log("Add inputs to JSON object", createDebit)

        //Send data to create budget
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        let createUserRequest = await fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/DirectDebit/CreateDebit`,
            {
                method: 'POST', body: JSON.stringify(createDebit),
                mode: 'cors',
                headers: myHeaders,
            }
        )

        //let response = await createUserRequest.json();


        if (createUserRequest.ok) {
            console.log("added direct debit successfully")
        }
        return false;
    }

    const Column = (props) => {
        return (
            <div class="debit-detail-column">
                <div class="debit-column-left">
                    <a id="debit-name-title">{props.name}</a>
                    <a id="debit-due-title">due date</a>
                </div>
                <div class="debit-column-right">
                    <a id="debit-amount">due</a>
                    <span id="debit-action-button" class="material-symbols-outlined">
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
            event.preventDefault();
            event.stopPropagation();
            const budgetId = sessionStorage.getItem("BudgetId")

            const createDebit = {
                BudgetId: budgetId,
                DebitName: directDebitName,
                DebitAmount: directDebitAmount,
                DebitDate: paymentDate,
                Frequency: interval
            }
            console.log("Add inputs to JSON object", createDebit)

            //Send data to create budget
            let sessionId = cookies.SessionID
            console.log(sessionId)

            const myHeaders = new Headers();
            myHeaders.append("x-api-key", sessionId)

            let createUserRequest = await fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/DirectDebit/CreateDebit`,
                {
                    method: 'POST', body: JSON.stringify(createDebit),
                    mode: 'cors',
                    headers: myHeaders,
                }
            )

            //let response = await createUserRequest.json();


            if (createUserRequest.ok) {
                console.log("added direct debit successfully")
            }

        }

        setValidated(true);
    };


    return (
        <div className="centre-form">
            <Form noValidate validated={validated} onSubmit={handleSubmit} className="centre-form" centred>
                {error ? <p className="errorbx" >Username or password incorrect</p> : ""}
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
                    <Form.Group controlId="validationCustomUsername">
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
                    <Form.Group controlId="validationCustomUsername">
                        <Form.Label>Interval</Form.Label>
                        <InputGroup hasValidation className="input-box">
                            <Form.Control
                                type="number"
                                onChange={(e) => setInterval(e.target.value)}
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please input an interval.
                            </Form.Control.Feedback>
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
                    <button className="update-button" type="submit">Create direct debit</button>
                </Row>
            </Form>
            <Form.Text muted>
                You can click CLOSE, if you do NOT want to add direct debits.
            </Form.Text>
        </div>
    );
}

export default CreateDebit