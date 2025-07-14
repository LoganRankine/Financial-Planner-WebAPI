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
import serverConfig from "../../server-config.json"

function BudgetListColumn({ budget, key, refresh }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [budgetId, setBudgetId] = useState("");
    const [budgetName, setBudgetName] = useState("");
    const [extendDetail, setExtendDetail] = useState("120px");
    const [extendDetailText, setExtendDetailText] = useState(false);

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

        const deleteRequest = await fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/DeleteBudget?budget_Id=${budgetId}`, {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors'
        })

        if (deleteRequest.status == 200) {
            setShowDelete(false)
            const message = await deleteRequest.json()
            setIsSuccess(true)
            setDeleteStatusText(message.SuccessTitle)
            setDeleteStatus(true)
            refresh()
            console.log("delete was successful")
        }
        else {
            setShowDelete(false)
            const message = await deleteRequest.json()
            setIsSuccess(true)
            setDeleteStatusText(message.ErrorTitle)
            setDeleteStatus(true)
            refresh()
            console.log("delete failed")
        }
    }

    useEffect(() => {
        setBudgetId(budget.BudgetId)
        setBudgetName(budget.BudgetName)
        var startDate = new Date(budget.StartDate)
        var endDate = new Date(budget.EndDate)
        setformattedStartDate(format(startDate, "dd-MM-yyyy"))
        setformattedEndDate(format(endDate, "dd-MM-yyyy"))
    }, []);

    const handleEdit = () => setShow(true);

    const getBudgetId = async (event) => {
        console.log(budgetId)
    }

    const directBudget = async (event) => {
        window.location.href = `/Account/Display/Budget/budget_id=${budgetId}`
        sessionStorage.setItem("currentBudget", budgetId)
    }

    const handleExpansion = async (event) => {
        setExtendDetail("100px")
        if (!extendDetailText) {
            setExtendDetailText(true)
        }
        else {
            setExtendDetailText(false)

        }
        console.log("clicked")
    }

    return (
        <>
            <tr>
                <th onClick={directBudget}>
                    {budgetName}
                </th>
                <td onClick={{/*directBudget*/ }}>{formattedStartDate}</td>
                <td onClick={directBudget}>{formattedEndDate}</td>
                <td onClick={directBudget}>
                    <a id="available-text">Available amout:</a>
                    <a id="avaliable">&#163;{budget.AvailableAmount.toFixed(2)}</a>
                </td>
                <td >&#163;{budget.WeeklyAmount.toFixed(2)}</td>
                <td>
                    <span className="material-symbols-outlined" style={{ cursor: 'pointer' }} onClick={handleEdit}>edit</span>
                    <span id="delete-icon" className="material-symbols-outlined" onClick={handleDelete}>delete</span>
                </td>
                <td>
                    <EditBudget showEdit={show} setShowEdit={setShow} budget={budget} _refresh={refresh}></EditBudget>
                </td>
            </tr>
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
                        <strong className="me-auto">{!budget.BudgetName ? "Error occured" : budget.BudgetName}</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body>{deleteStatusText}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );


//    return (
//        <div style={isSuccess ? { display: 'none' } : { display: 'flex' }} className={extendDetailText ? "list-content-column-expand" : "list-content-column"} >
//            <details>
//                <summary>
//                    <div className="list-content-item">
//                        <div onClick={directBudget} id="budget-title">{budgetName}</div>
//                        <div className="desktop-hide" onClick={handleExpansion}>
//                            <a id="more-detail" >{extendDetailText ? "Less detail" : "More Detail"} <span className="material-symbols-outlined">arrow_drop_down</span></a>
//                        </div>
//                    </div>
//                    <div className="list-content-item mobile-hide" onClick={directBudget}>{formattedStartDate}</div>
//                    <div className="list-content-item mobile-hide" onClick={directBudget}>{formattedEndDate}</div>
//                    <div id="avaliable-content" className="list-content-item" onClick={directBudget}>
//                        <a id="available-text">Available amout:</a>
//                        <a id="avaliable">&#163;{budget.AvailableAmount.toFixed(2)}</a>
//                    </div>
//                    <div id="available-amount" className="mobile-hide list-content-item">&#163;{budget.WeeklyAmount.toFixed(2)}</div>
//                    <div className="list-content-option">
//                        <span className="material-symbols-outlined" style={{ cursor: 'pointer' }} onClick={handleEdit}>edit</span>
//                        <span id="delete-icon" className="material-symbols-outlined" onClick={handleDelete}>delete</span>
//                    </div>
//                    <EditBudget showEdit={show} setShowEdit={setShow} budget={budget} _refresh={refresh}></EditBudget>
//                </summary>
//                <div>
//                    she's a runner, she's a track star.
//                </div>
//            </details>
//            <Modal show={showDelete} onHide={handleClose} animation={true} centered >
//                <Modal.Header closeButton>
//                    <Modal.Title>Delete Budget</Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    <p style={{ fontWeight: '400' }}>You are deleting the budget: <b>{budgetName}</b>, are you sure?</p>
//                </Modal.Body>
//                <Modal.Footer>
//                    <Button variant="danger" onClick={deleteBudget}>
//                        Delete
//                    </Button>
//                    <Button variant="secondary">
//                        Cancel
//                    </Button>

//                    </Modal.Footer>
//            </Modal>
//            <ToastContainer position="top-end" >
//                <Toast show={deleteStatus} onClose={toggleDeleteStatus} animation={true} bg={isSuccess ? "success" : "warning"} delay={3000} autohide>
//                    <Toast.Header>
//                        <img
//                            src="holder.js/20x20?text=%20"
//                            className="rounded me-2"
//                            alt=""
//                        />
//                        <strong className="me-auto">{!budget.BudgetName ? "Error occured" : budget.BudgetName}</strong>
//                        <small>Just now</small>
//                    </Toast.Header>
//                    <Toast.Body>{deleteStatusText}</Toast.Body>
//                </Toast>
//            </ToastContainer>
//        </div>
//    );
}

export default BudgetListColumn