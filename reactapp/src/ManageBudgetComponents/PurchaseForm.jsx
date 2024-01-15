import React, { Children, Component, useState } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import Alert from 'react-bootstrap/Alert';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import serverConfig from "../../server-config.json"

function PurchaseForm({ budget_id, show, setShow }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [itemName, setItemName] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [itemAmount, setItemAmount] = useState("");

    const handleClose = () => setShow(false);

    const addPurchase = async (event) => {
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

        let createPurchaseRequest = await fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/CreateBudgetItem`,
            {
                method: 'POST', body: JSON.stringify(createPurchase),
                mode: 'cors',
                headers: myHeaders,
            }
        )

        let response = await createPurchaseRequest.json();

        if (createPurchaseRequest.ok) {
            try {
                //Get BudgetId from response
                const BudgetItemObject = JSON.parse(response)
                console.log(BudgetItemObject)
                handleClose()
                //sessionStorage.setItem("BudgetId", budgetObject.BudgetId)
                //console.log(budgetObject.BudgetName, "created, budgetID added to session storage")
                //console.log(this.state.isBudgetDetail)
            }
            catch (err) {
                console.error(err)
            }
        }
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Add Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="purchase-creation-content">
                        <div class="input-container">
                            <label>Purchase Name</label><br />
                            <input type="text" value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
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
                                class="input-box" />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={addPurchase}>
                        Update
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default PurchaseForm