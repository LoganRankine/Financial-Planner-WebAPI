import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

import { Modal, Button, Toast, ToastContainer, Form, Row, Spinner } from 'react-bootstrap';

import serverConfig from "../../server-config.json"

function EditBudgetItem({ showEdit, setShowEdit, budgetItem, _refresh }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [itemName, setItemName] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [itemAmount, setItemAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    const [deleteStatus, setDeleteStatus] = useState(false);
    const [deleteStatusText, setDeleteStatusText] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleDeleteStatus = () => setDeleteStatus(!deleteStatus);

    const handleCloseEdit = () => setShowEdit(false);

    const handleEdit = () => setShowEdit(true);

    const editBudgetItem = () => {
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
        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/EditBudgetItem`,
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
                    _refresh()
                })
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

            editBudgetItem()
        }

        setValidated(true);
    };

    useEffect(() => {
        setPurchaseDate(budgetItem.PurchaseDate)
        setItemName(budgetItem.ItemName)
        setItemAmount(budgetItem.ItemAmount)
    }, []);


    return (
        <div>
            <Modal show={showEdit} onHide={handleCloseEdit} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Edit <b>{budgetItem.ItemName}</b> Information</Modal.Title>
                </Modal.Header>
                <Modal.Body className="centre-form">
                    <Form.Text className="description-text">
                        You can make changes to your purchase details
                        by updating only the information you need. If you want to edit the purchase <b>name</b>, payment <b>date</b>,
                        or <b>amount</b>, simply fill in the respective field. <b>No need to fill out everything, just update what you want</b>.
                    </Form.Text>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} className="centre-form" centred>
                        <Row className="mb-3">
                            <Form.Group class="input-container">
                                <Form.Label>Purchase Name</Form.Label><br />
                                <Form.Control type="text" value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder={budgetItem.ItemName}
                                    class="input-box" />
                            </Form.Group>
                            <Form.Group class="input-container">
                                <Form.Label>Purchase Date</Form.Label><br />
                                <Form.Control type="datetime-local" value={purchaseDate}
                                    onChange={(e) => setPurchaseDate(e.target.value)}
                                    class="input-box" />
                            </Form.Group>
                            <Form.Group class="input-container">
                                <Form.Label>Purchase Amount</Form.Label><br />
                                <Form.Control type="number" value={itemAmount}
                                    onChange={(e) => setItemAmount(e.target.value)}
                                    placeholder={budgetItem.ItemAmount}
                                    class="input-box" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <button className="update-button" type="submit">
                                {loading ? <>
                                    <Spinner animation="border" variant="info" role="status" size="sm" />
                                    <span> Updating Purchase</span>
                                </> : 'Update Purchase'}
                            </button>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
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