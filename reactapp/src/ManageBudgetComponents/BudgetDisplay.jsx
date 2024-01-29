import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/Budget.css'
import BudgetItemColumn from './BudgetItemColumn'
import PurchaseForm from './PurchaseForm'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import serverConfig from "../../server-config.json"

function BudgetDisplay({Sidebar }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [budgetItems, setBudgetItems] = useState(null);
    const [show, setShow] = useState(false);
    const [p_budgetId, setBudgetId] = useState("");
    const [p_budget, setBudget] = useState("");

    const handleShow = () => setShow(true);

    useEffect(() => {
        const query = window.location.pathname.replace("/Account/Display/Budget/budget_id=", "")
        setBudgetId(query)
        const myHeaders = new Headers();
        let sessionId = cookies.SessionID

        myHeaders.append("x-api-key", sessionId)
        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/BudgetItems?budget_Id=${query}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => response.json()).then(data => {
            const temp = JSON.parse(data)
            console.log(temp)
            setBudgetItems(temp)
            setBudgetId(query)
        });

        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/GetBudget?budget_Id=${query}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => response.json()).then(data2 => {
            console.log("Budget details", data2)
            setBudget(data2)
        });
    }, []);

    console.log("BudgetId from query",p_budgetId)


    return (
        <div className="base-content">
            <Sidebar budget_id={p_budgetId}></Sidebar>
            <PurchaseForm budget_id={p_budgetId} show={show} setShow={setShow}></PurchaseForm>
            <div className="budget-display">
                <div className="budget-header">
                    {/*left header*/}
                    <div className="budget-header-right">
                        <a style={{ backgroundColor: "white" }} className="budget-header-item">{p_budget.BudgetName}</a>
                        <a className="budget-header-item mobile-hide">Weekly total: </a>
                        <a className="budget-header-item mobile-hide">Weekly target: &#163;{!p_budget.WeeklyAmount ? 0 : p_budget.WeeklyAmount.toFixed(2)}</a>
                    </div>
                    {/*right header*/}
                    <div className="budget-header-right">
                        <button className="budget-header-item" onClick={handleShow}>Add Purchase</button>
                    </div>
                </div>
                <div className="budget-content">
                    {!budgetItems ? 'Loading' : budgetItems.map(budgetItem => (< BudgetItemColumn budgetItem={budgetItem} key={budgetItem.Id} />))}
                </div>
            </div>

        </div>
    );
}

export default BudgetDisplay