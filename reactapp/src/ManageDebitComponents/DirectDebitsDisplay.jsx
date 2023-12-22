import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/Budget.css'
import DebitColumn from './DebitColumn'
import CreateDebitForm from './CreateDebitForm'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DirectDebitsDisplay({Sidebar}) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [directDebits, setDirectDebits] = useState(null);
    const [show, setShow] = useState(false);
    const [p_budgetId, setBudgetId] = useState("");
    const [p_budget, setBudget] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        let sessionId = cookies.SessionID
        const query = window.location.pathname.replace("/Account/Display/DirectDebits/budget_id=", "")

        setBudgetId(query)
        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)
        fetch(`https://localhost:7073/api/DirectDebit/AllDirectDebits?budget_Id=${query}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => response.json()).then(data => {
            const temp = JSON.parse(data)
            console.log(temp)
            setDirectDebits(temp)
            setBudgetId(query)
        });
    }, []);

    console.log("BudgetId from query", p_budgetId)


    return (
        <div className="base-content">
            <Sidebar budget_id={p_budgetId}></Sidebar>
            <div className="budget-display">
                <Modal show={show} onHide={handleClose} animation={true} centered >
                    <Modal.Header closeButton>
                        <Modal.Title>Add Direct Debit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CreateDebitForm budget_id={p_budgetId}></CreateDebitForm>
                    </Modal.Body>
                </Modal>

                <div className="budget-header">
                    {/*right header*/}
                    <div className="budget-header-right">
                        <button className="budget-header-item" onClick={handleShow}>Add Direct Debit</button>
                    </div>
                </div>
                <div className="budget-content">
                    {!directDebits ? 'Loading' : directDebits.map(p_directDebit => (<DebitColumn directDebit={p_directDebit} />))}
                    {/*    <DebitColumn></DebitColumn>*/}
                </div>
            </div>
        </div>
    );
}

export default DirectDebitsDisplay