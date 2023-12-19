import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/Budget.css'
import BudgetItemColumn from './BudgetItemColumn'
import PurchaseForm from './PurchaseForm'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
function BudgetDisplay() {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [budgetItems, setBudgetItems] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        let sessionId = "139b5da0-84c9-4ebf-9a5b-d1494a80dc6e"
        let budget_Id = "3266cb34-223b-42d7-9380-59cae4d587d2"

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)
        fetch(`https://localhost:7073/api/Budget/BudgetItems?budget_Id=${budget_Id}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => response.json()).then(data => {
            const temp = JSON.parse(data)
            console.log(temp)
            setBudgetItems(temp)
        });
    }, []);


    return (
        <div className="budget-display">
            <Modal show={show} onHide={handleClose} animation={true} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Add Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PurchaseForm></PurchaseForm>
                </Modal.Body>
            {/*    <Modal.Footer>*/}
            {/*        <Button variant="secondary" onClick={handleClose}>*/}
            {/*            Close*/}
            {/*        </Button>*/}
            {/*    </Modal.Footer>*/}
            </Modal>
            <div className="budget-header">
                {/*left header*/}
                <div className="budget-header-right">
                    <a className="budget-header-item">Weekly total: </a>
                    <a className="budget-header-item">Weekly target: </a>
                </div>
                {/*right header*/}
                <div className="budget-header-right">
                    <button onClick={handleShow}>Add Purchase</button>
                </div>
            </div>
            <div className="budget-content">
                {!budgetItems ? 'Loading' : budgetItems.map(budgetItem => (< BudgetItemColumn budgetItem={budgetItem} />))}
            </div>
        </div>
    );
}

export default BudgetDisplay