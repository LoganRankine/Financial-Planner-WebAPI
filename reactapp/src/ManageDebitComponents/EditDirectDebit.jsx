import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import serverConfig from "../../server-config.json"

function EditDirectForm({ showEdit, setShowEdit, debit }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [directDebitName, setDirectDebitName] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [interval, setInterval] = useState("");
    const [directDebitAmount, setDebitAmount] = useState(null);

    const [deleteStatus, setDeleteStatus] = useState(false);
    const [deleteStatusText, setDeleteStatusText] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleDeleteStatus = () => setDeleteStatus(!deleteStatus);

    const handleCloseEdit = () => setShowEdit(false);
    const handleEdit = () => setShowEdit(true);

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
                <Modal.Body>
                    <div class="debit-creation-content">
                        <div class="debit-detail-input">
                            <div class="input-container">
                                <label>Direct Debit Name</label><br />
                                <input type="text" value={directDebitName}
                                    onChange={(e) => setDirectDebitName(e.target.value)}
                                    class="input-box"
                                    placeholder={debit.DebitName}
                                />
                            </div>
                            <div class="input-container">
                                <label>Payment Date</label><br />
                                <input type="text" value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    class="input-box"
                                    onFocus={(e) => (e.target.type = "date")}
                                    placeholder={debit.DebitDate}
                                />
                            </div>
                            <div class="input-container">
                                <label>Interval</label><br />
                                <input type="number" value={interval}
                                    onChange={(e) => setInterval(e.target.value)}
                                    class="input-box"
                                    placeholder={debit.Frequency}
                                />
                            </div>
                            <div class="input-container">
                                <label>Amount</label><br />
                                <input type="number" value={directDebitAmount}
                                    onChange={(e) => setDebitAmount(e.target.value)}
                                    class="input-box"
                                    placeholder={debit.DebitAmount}
                                />
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={edit}>
                        Update
                    </Button>
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