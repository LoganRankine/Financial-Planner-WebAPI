import React, { Children, Component, useState, useEffect } from 'react';
import { format } from "date-fns";

import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/AccountHomepage.css'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import EditBudget from './EditBudget';

function BudgetListColumn(budgets) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [budgetId, setBudgetId] = useState("");
    const [budgetName, setBudgetName] = useState("");

    const [show, setShow] = useState(false);
    const [formattedStartDate, setformattedStartDate] = useState("");
    const [formattedEndDate, setformattedEndDate] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [deleteStatusText, setDeleteStatusText] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleDeleteStatus = () => setDeleteStatus(!deleteStatus);
    const handleClose = () => setShowDelete(false);
    const handleDelete = () => setShowDelete(true);

    const deleteBudget = async () => {
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        const deleteRequest = await fetch(`https://localhost:7073/api/Budget/DeleteBudget?budget_Id=${budgetId}`, {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors'
        })

        if (deleteRequest.ok) {
            setShowDelete(false)
            const message = await deleteRequest.json()
            setIsSuccess(true)
            setDeleteStatusText(message.SuccessTitle)
            setDeleteStatus(true)
            console.log("delete was successful")
        }
        else {
            setShowDelete(false)
            const message = await deleteRequest.json()
            setIsSuccess(true)
            setDeleteStatusText(message.ErrorTitle)
            setDeleteStatus(true)
            console.log("delete failed")
        }
    }

    useEffect(() => {
        setBudgetId(budgets.budgets.BudgetId)
        setBudgetName(budgets.budgets.BudgetName)
        var startDate = new Date(budgets.budgets.StartDate)
        var endDate = new Date(budgets.budgets.EndDate)
        setformattedStartDate(format(startDate, "dd-MM-yyyy"))
        setformattedEndDate(format(endDate, "dd-MM-yyyy"))
    }, []);

    const handleEdit = () => setShow(true);

    const getBudgetId = async (event) => {
        console.log(budgetId)
    }

    const directBudget = async (event) => {
        window.location.href = `/Account/Display/Budget/budget_id=${budgetId}`
    }

    return (
        <div className="list-content-column" >
            <EditBudget showEdit={show} setShowEdit={setShow} budget={budgets.budgets}></EditBudget>
            <div className="list-content-item" onClick={directBudget}>{budgetName}</div>
            <div className="list-content-item" onClick={directBudget}>{formattedStartDate}</div>
            <div className="list-content-item" onClick={directBudget}>{formattedEndDate}</div>
            <div className="list-content-item" onClick={directBudget}>&#163;{budgets.budgets.AvailableAmount.toFixed(2)}</div>
            <div className="list-content-item">&#163;{budgets.budgets.WeeklyAmount.toFixed(2)}</div>
            <div className="list-content-option">
                <span class="material-symbols-outlined" style={{ cursor: 'pointer' } } onClick={handleEdit}>edit</span>
                <span id="delete-icon" class="material-symbols-outlined" onClick={handleDelete}>delete</span>
            </div>
            <Modal show={showDelete} onHide={handleClose} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Budget</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ fontWeight: '400' }}>You are deleting the budget: <b>{budgetName}</b>, are you sure?</p>
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
                        <strong className="me-auto">{!budgets.budgets.BudgetName ? "Error occured" : budgets.budgets.BudgetName}</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body>{deleteStatusText}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default BudgetListColumn