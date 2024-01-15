import React, { Children, Component, useState } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Modal from 'react-bootstrap/Modal';
import serverConfig from "../../server-config.json"

function CreateDebitForm({ budget_id, show, setShow }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [directDebitName, setDirectDebitName] = useState("");
    const [createdDebit, setCreatedDebit] = useState(null);
    const [paymentDate, setPaymentDate] = useState("");
    const [interval, setInterval] = useState("");
    const [directDebitAmount, setDebitAmount] = useState("");

    const [createStatus, setCreateStatus] = useState(false);
    const [createStatusText, setCreateStatusText] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleDeleteStatus = () => setCreateStatus(!createStatus);

    const handleClose = () => setShow(false);

    //Add direct debits
    const saveDebit = async (event) => {
        const budgetId = budget_id

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
        if (createUserRequest.status == 201) {
            const newBudget = await createUserRequest.json()
            setCreatedDebit(newBudget)
            setIsSuccess(true)
            setCreateStatus(true)
            console.log("added direct debit successfully")
        }
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Add Direct Debit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="debit-creation-content">
                        <div class="debit-detail-input">
                            <div class="input-container">
                                <label>Direct Debit Name</label><br />
                                <input type="text" value={directDebitName}
                                    onChange={(e) => setDirectDebitName(e.target.value)}
                                    class="input-box" />
                            </div>
                            <div class="input-container">
                                <label>Payment Date</label><br />
                                <input type="date" value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    class="input-box" />
                            </div>
                            <div class="input-container">
                                <label>Interval</label><br />
                                <input type="number" value={interval}
                                    onChange={(e) => setInterval(e.target.value)}
                                    class="input-box" />
                            </div>
                            <div class="input-container">
                                <label>Amount</label><br />
                                <input type="number" value={directDebitAmount}
                                    onChange={(e) => setDebitAmount(e.target.value)}
                                    class="input-box" />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={saveDebit}>
                        Create
                    </Button>
                    <Button variant="secondary" onClick={handleClose} >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-center" >
                <Toast show={createStatus} onClose={toggleDeleteStatus} animation={true} bg={isSuccess ? "success" : "warning"} delay={3000} autohide>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">{!createdDebit ? "Error occured" : `${createdDebit.DebitName} created`}</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body>{createStatusText}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default CreateDebitForm