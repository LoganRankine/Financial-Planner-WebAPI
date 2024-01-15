import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import '../css/Budget.css'

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import EditDirectForm from './EditDirectDebit';
import serverConfig from "../../server-config.json"

function DebitColumn({ directDebit }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [debitId, setDebitId] = useState("");
    const [budgetId, setBudgetId] = useState("");
    const [debitName, setDebitName] = useState(null);
    const [sendRequest, setSendRequest] = useState(false);

    const [formatedDueDate, setFormattedDueDate] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [deleteStatusText, setDeleteStatusText] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleDeleteStatus = () => setDeleteStatus(!deleteStatus);
    const handleClose = () => setShowDelete(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleDelete = () => setShowDelete(true);
    const handleEdit = () => setShowEdit(true);

    useEffect(() => {
        setDebitId(directDebit.DebitId)
        setDebitName(directDebit.DebitName)
        setBudgetId(directDebit.BudgetId)
        var dueDate = new Date(directDebit.DebitDate)

        let date = format(dueDate, "EEEE do LLLL yyyy")
        setFormattedDueDate(`${date}`)

    }, []);

    const deleteDebit = async () => {
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        const deleteDebitRequest = await fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/DirectDebit/DeleteDirectDebit?budget_Id=${budgetId}&debit_Id=${debitId}`, {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors'
        })

        if (deleteDebitRequest.ok) {
            setShowDelete(false)
            const message = await deleteDebitRequest.json()
            setIsSuccess(true)
            setDeleteStatusText(message.SuccessTitle)
            setDeleteStatus(true)
            console.log("delete was successful")
        }
        else {
            setShowDelete(false)
            const message = await deleteDebitRequest.json()
            setIsSuccess(false)
            setDeleteStatusText(message.ErrorTitle)
            setDeleteStatus(true)
            console.log("delete failed")
        }
    }

    return (
        <div className="debit-content-item">
            <div className="debit-item-box">
                <div className="debit-item-left">
                    <a className="debit-item-title">{debitName}</a>
                    <div className="debit-item-left-box">
                        <div>
                            <a className="debit-item-date">Due: {formatedDueDate}</a>
                        </div>
                        <div>
                            <a id="debit-item-frequency" className="debit-item-date">Every {directDebit.Frequency} days</a>
                        </div>
                    </div>
                </div>
                <div className="debit-item-right">
                    <a className="debit-item-price">&#163;{directDebit.DebitAmount}</a>
                    <div className="list-content-option">
                        <span class="material-symbols-outlined" onClick={handleEdit}>edit</span>
                        <span id="delete-icon" class="material-symbols-outlined" onClick={handleDelete}>delete</span>
                    </div>
                </div>
            </div>
            <Modal show={showDelete} onHide={handleClose} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Direct Debit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ fontWeight: '400' }}>You are deleting the direct debit: <b>{debitName}</b>, are you sure?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={deleteDebit}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>

                </Modal.Footer>
            </Modal>
            <EditDirectForm showEdit={showEdit} setShowEdit={setShowEdit} debit={directDebit}></EditDirectForm>
        </div>
    );
}

export default DebitColumn