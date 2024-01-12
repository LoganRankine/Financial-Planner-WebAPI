import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

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

    const editBudgetItem = (event) => {
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
        fetch("https://localhost:7073/api/Budget/EditBudget",
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

    return (
        <div>
            <Modal show={showEdit} onHide={handleCloseEdit} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Edit <b>{budget.ItemName}</b> Information</Modal.Title>
                </Modal.Header>
                <Modal.Body centered>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <div class="input-container">
                            <label>Budget Name</label><br />
                            <input type="text" value={budgetName}
                                onChange={(e) => setBudgetName(e.target.value)}
                                placeholder={budget.BudgetName}
                                class="input-box" />
                        </div>
                        <div class="input-container">
                            <label>Start Date</label><br />
                            <input type="datetime-local" value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                onFocus={(e) => (e.target.type = "date")}
                                placeholder={budget.StartDate}
                                class="input-box" />
                        </div>
                        <div class="input-container">
                            <label>End Date</label><br />
                            <input type="datetime-local" value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                onFocus={(e) => (e.target.type = "date")}
                                placeholder={budget.EndDate}
                                class="input-box" />
                        </div>
                        <div class="input-container">
                            <label>Total Budget Amount</label><br />
                            <input type="number" value={budgetAmount}
                                onChange={(e) => setBudgetAmount(e.target.value)}
                                placeholder={budget.BudgetAmount}
                                class="input-box" />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={editBudgetItem}>
                        Update
                    </Button>
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