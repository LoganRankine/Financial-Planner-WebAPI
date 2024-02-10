import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/Budget.css'
import DebitColumn from './DebitColumn'
import CreateDebitForm from './CreateDebitForm'
import CreateDebit from '../ManageDebitComponents/CreateDebit'

import { Button, Spinner, Modal } from 'react-bootstrap';
import serverConfig from "../../server-config.json"

function DirectDebitsDisplay({Sidebar}) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [directDebits, setDirectDebits] = useState(null);
    const [p_budgetId, setBudgetId] = useState("");
    const [p_budget, setBudget] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const query = sessionStorage.getItem("currentBudget")

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const getDirectDebits = (query) => {
        setLoading(true)

        let sessionId = cookies.SessionID
        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        //Get all direct debits that are assoiated with budget id
        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/DirectDebit/AllDirectDebits?budget_Id=${query}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => {
            if (response.status == 200) {
                response.json().then(data => {
                    const temp = JSON.parse(data)
                    console.log(temp)
                    setDirectDebits(temp)
                    setBudgetId(query)
                    setLoading(false)
                })
            }
        });
    }

    const getBudget = (query) => {

        let sessionId = cookies.SessionID

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        setLoading(true)
        //get the budget name
        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/GetBudget?budget_id=${query}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(result => result.json()).then(data => {
            setLoading(false)
            console.log(data)
            console.log("Got budget")
            setBudget(data)
            setLoading(false)
        });

    }

    useEffect(() => {
        setLoading(true)

        getDirectDebits(query)

        getBudget(query)

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
                        <CreateDebit></CreateDebit>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/*<CreateDebitForm budget_id={p_budgetId} show={show} setShow={setShow }></CreateDebitForm>*/}
                <div className="budget-header">
                    {/*right header*/}
                    <div className="budget-header-right">
                        <a style={{ backgroundColor: "white" }} className="budget-header-item">{p_budget.BudgetName}</a>
                    </div>

                    <div className="budget-header-right">
                        <button className="budget-header-item" onClick={handleShow}>Add Direct Debit</button>
                    </div>
                </div>
                <div className="budget-content">
                    {loading ? <div className="no-budgets"><Spinner animation="border" variant="info" role="status"></Spinner></div> : <></>}
                    {!directDebits ? <div className={loading ? "budgets-loading" : "no-budgets"}>No Direct Debits</div> : directDebits.map(p_directDebit => (<DebitColumn directDebit={p_directDebit} key={p_directDebit.Id} />))}


                    {/*    <DebitColumn></DebitColumn>*/}
                </div>
            </div>
        </div>
    );
}

export default DirectDebitsDisplay