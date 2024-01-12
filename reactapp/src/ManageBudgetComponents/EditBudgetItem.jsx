import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function EditBudgetItem({ showEdit, setShowEdit, budgetItem }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [itemName, setItemName] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [itemAmount, setItemAmount] = useState("");

    const [deleteStatus, setDeleteStatus] = useState(false);
    const [deleteStatusText, setDeleteStatusText] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleDeleteStatus = () => setDeleteStatus(!deleteStatus);

    const handleCloseEdit = () => setShowEdit(false);
    const handleEdit = () => setShowEdit(true);

    const editBudgetItem = (event) => {
        const budgetId = budgetItem.BudgetId

        const editBudgetItem = {
            BudgetId: budgetId,
            ItemId: budgetItem.ItemId,
            ItemName: itemName,
            ItemAmount: itemAmount,
            PurchaseDate: purchaseDate,
        }
        console.log("Add inputs to JSON object", editBudgetItem)

        //Send data to create budget
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)
        fetch("https://localhost:7073/api/Budget/EditBudgetItem",
            {
                method: 'PUT', body: JSON.stringify(editBudgetItem),
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
                    console.log("added direct budget successfully")
                })
            }
        })
    }

    return (
        <div>
            <Modal show={showEdit} onHide={handleCloseEdit} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Edit <b>{budgetItem.ItemName}</b> Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="purchase-creation-content">
                        <div class="input-container">
                            <label>Purchase Name</label><br />
                            <input type="text" value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                placeholder={budgetItem.ItemName}
                                class="input-box" />
                        </div>
                        <div class="input-container">
                            <label>Purchase Date</label><br />
                            <input type="datetime-local" value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                                class="input-box" />
                        </div>
                        <div class="input-container">
                            <label>Purchase Amount</label><br />
                            <input type="number" value={itemAmount}
                                onChange={(e) => setItemAmount(e.target.value)}
                                placeholder={budgetItem.ItemAmount}
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
                        <strong className="me-auto">{!isSuccess ? "Error occured" : `${budgetItem.ItemName} updated`}</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body>{deleteStatusText}</Toast.Body>
                </Toast>
            </ToastContainer>

        </div>
    );
}

export default EditBudgetItem