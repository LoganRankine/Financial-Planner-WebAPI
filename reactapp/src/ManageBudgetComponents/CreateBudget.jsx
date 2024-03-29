import React, { Children, Component, useState } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import serverConfig from "../../server-config.json"
import CreateDebit from '../ManageDebitComponents/CreateDebit'

import {Modal, Button, Col, Form, InputGroup, Row, Spinner} from 'react-bootstrap';

function CreateBudget() {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [budgetName, setBudgetName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budgetAmount, setBudgetAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(false);
    const [showBudget, setshowBudget] = useState(true);

    const createBudget = () => {
        const createBudget = {
            BudgetName: budgetName,
            AvailableAmount: budgetAmount,
            StartDate: startDate,
            EndDate: endDate,
        }
        console.log("Add inputs to JSON object", createBudget)

        //Send data to create budget
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/CreateBudget`,
            {
                method: 'POST', body: JSON.stringify(createBudget),
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => {
            if (response.status == 201) {
                response.json().then(data => {
                    setLoading(false)
                    const budgetObject = JSON.parse(data)
                    sessionStorage.setItem("currentBudget", budgetObject.BudgetId)
                    sessionStorage.setItem("BudgetStart", budgetObject.StartDate)
                    console.log(budgetObject.BudgetName, "created, budgetID added to session storage")
                    setshowBudget(false)
                })
            }
            if (response.status == 400)
            {
                setLoading(false)
            }
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

            createBudget()
        }

        setValidated(true);
    };

    const saveBudget = async (event) => {
        const createBudget = {
            BudgetName: budgetName,
            AvailableAmount: budgetAmount,
            StartDate: startDate,
            EndDate: endDate,
        }
        console.log("Add inputs to JSON object", createBudget)

        //Send data to create budget
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        let createUserRequest = await fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/CreateBudget`,
            {
                method: 'POST', body: JSON.stringify(createBudget),
                mode: 'cors',
                headers: myHeaders,
            }
        )

        let response = await createUserRequest.json();


        if (createUserRequest.ok) {
            try {
                //Get BudgetId from response
                const budgetObject = JSON.parse(response)
                sessionStorage.setItem("BudgetId", budgetObject.BudgetId)
                console.log(budgetObject.BudgetName, "created, budgetID added to session storage")
                console.log(this.state.isBudgetDetail)
                return false;
            }
            catch (err) {
                console.error(err)
                return false;
            }
        }
        return false;
    }

    if (showBudget) {
        return (
            <div className="centre-form">
                <Form.Text className="description-text">
                    Welcome to the Budget Creation Form! Start by giving your budget a <b>name</b>, then pick the <b>start</b> and <b>end</b> dates to define the period you want to budget for.
                    Finally, enter the total <b>amount</b> of money you have at the beginning of this period.
                </Form.Text>
                <Form noValidate validated={validated} onSubmit={handleSubmit} className="centre-form">
                    <Row className="mb-3">
                        <Form.Group >
                            <Form.Label>Budget Name</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) => setBudgetName(e.target.value)}
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please input a budget name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="validationCustomUsername">
                            <Form.Label>Total Budget Amount</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    onChange={(e) => setBudgetAmount(e.target.value)}
                                    placeholder="0000"
                                    aria-describedby="inputGroupPrepend"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please input a budget amount.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="validationCustomUsername">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                onChange={(e) => setStartDate(e.target.value)}
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please select a start date.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="validationCustomUsername">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={!endDate ? startDate : endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please select a end date.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <button className="update-button" type="submit">
                            {loading ? <>
                                <Spinner animation="border" variant="info" role="status" size="sm" />
                                <span> Creating budget</span>
                            </> : 'Create budget'}
                        </button>
                    </Row>
                </Form>
            </div>
        );
    }
    else {
        return (
            <CreateDebit refreshFunction={false}></CreateDebit>
        );
    }
}
export default CreateBudget