import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import { Modal, Button, Toast, ToastContainer } from 'react-bootstrap';
import serverConfig from "../../server-config.json"

import '../css/Budget.css'
import EditBudgetItem from './EditBudgetItem';
function BudgetItemColumn({ budgetItem, key, refresh }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [itemId, setItemId] = useState("");
    const [budgetId, setBudgetId] = useState("");
    const [itemName, setItemName] = useState(null);

    const [formattedPurchaseDate, setFormattedPurchaseDate] = useState("");

    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [deleteStatusText, setDeleteStatusText] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleDeleteStatus = () => setDeleteStatus(!deleteStatus);
    const handleClose = () => setShowDelete(false);
    const handleDelete = () => setShowDelete(true);
    const handleEdit = () => setShowEdit(true);

    const deleteBudget = async () => {
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        const deleteItemRequest = await fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/DeleteBudgetItem?budget_Id=${budgetId}&budgetItem_Id=${itemId}`, {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors'
        })

        if (deleteItemRequest.ok) {
            setShowDelete(false)
            const message = await deleteItemRequest.json()
            setIsSuccess(true)
            setDeleteStatusText(message.SuccessTitle)
            setDeleteStatus(true)
            console.log("delete was successful")
            refresh()
        }
        else {
            setShowDelete(false)
            const message = await deleteItemRequest.json()
            setIsSuccess(false)
            setDeleteStatusText(message.ErrorTitle)
            setDeleteStatus(true)
            console.log("delete failed")
            refresh()
        }
    }

    useEffect(() => {
        setItemId(budgetItem.ItemId)
        setItemName(budgetItem.ItemName)
        setBudgetId(budgetItem.BudgetId)

        var purchaseDate = new Date(budgetItem.PurchaseDate)

        let date = format(purchaseDate, "EEEE do LLLL yyyy")
        let time = format(purchaseDate, "p")
        setFormattedPurchaseDate(`${date} at ${time}`)
    }, []);

    return (
        <div className="budget-content-item">
            <div className="budget-item-box">
                <div className="budget-item-left">
                    <a className="budget-item-title">{itemName}</a>
                    <a className="budget-item-date">{formattedPurchaseDate} </a>
                </div>
                <div className="budget-item-right">
                    <a className="budget-item-price">&#163;{budgetItem.ItemAmount}</a>
                    <div className="list-content-option">
                        <span className="material-symbols-outlined" onClick={handleEdit}>edit</span>
                        <span id="delete-icon" className="material-symbols-outlined" onClick={handleDelete}>delete</span>
                    </div>
                </div>
            </div>
            <EditBudgetItem showEdit={showEdit} setShowEdit={setShowEdit} budgetItem={budgetItem} _refresh={refresh}></EditBudgetItem>
            <Modal show={showDelete} onHide={handleClose} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ fontWeight: '400' }}>You are deleting the purchase: <b>{itemName}</b>, are you sure?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={deleteBudget}>
                        Delete
                    </Button>
                    <Button variant="secondary">
                        Cancel
                    </Button>

                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-end" >
                <Toast show={deleteStatus} onClose={toggleDeleteStatus} animation={true} bg={isSuccess ? "success" : "warning"} delay={3000} autohide>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">{!itemName ? "Error occured" : itemName}</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body>{deleteStatusText}</Toast.Body>
                </Toast>
            </ToastContainer>

        </div>
    );
}

export default BudgetItemColumn