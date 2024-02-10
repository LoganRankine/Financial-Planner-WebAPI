import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/Budget.css'
import BudgetItemColumn from './BudgetItemColumn'
import PurchaseForm from './PurchaseForm'
import { format, startOfWeek, isThisWeek } from "date-fns";

import { Button, Modal, Spinner } from 'react-bootstrap';
import serverConfig from "../../server-config.json"

function BudgetDisplay({Sidebar }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [budgetItems, setBudgetItems] = useState(null);
    const [weeklyTotal, setWeeklyTotal] = useState(null);
    const [weekBudgets, setWeekBudgets] = useState(null);
    const [nonFiltered, setNonFiltered] = useState(null);
    const [show, setShow] = useState(false);
    const [p_budgetId, setBudgetId] = useState("");
    const [p_budget, setBudget] = useState("");
    const [All, setAll] = useState(false);

    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);

    const handleShow = () => setShow(true);

    const getBudgetItems = (query) => {
        setLoading(true)
        const myHeaders = new Headers();
        let sessionId = cookies.SessionID

        myHeaders.append("x-api-key", sessionId)

        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/BudgetItems?budget_Id=${query}`,
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
                    setLoading(false)
                    setBudgetItems(temp)
                    setBudgetId(query)
                    calculateWeekly(temp)
                })
            }
            if (response.status == 204) {
                setLoading(false)
                setBudgetId(query)
            }
        });
    }

    const getBudget = (query) => {
        setLoading(true)

        const myHeaders = new Headers();
        let sessionId = cookies.SessionID

        myHeaders.append("x-api-key", sessionId)

        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/GetBudget?budget_Id=${query}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => {
            if (response.status == 200) {
                response.json().then(budget => {
                    setBudget(budget)
                    setLoading(false)
                });
            }
            if (response.status == 204) {
                setLoading(false)
            }
        })

    }

    useEffect(() => {
        setLoading(true)

        const query = sessionStorage.getItem("currentBudget")

        setBudgetId(query)
        getBudgetItems(query)

        getBudget(query)

    }, []);

    const currentWeek = (event) => {
        setAll(false)
        setBudgetItems(weekBudgets)
    }

    const calculateWeekly = (budgets) => {
        //ensure the copy from the server is retrieved and stored unmodified
        setNonFiltered(budgets)

        const weekBudget = budgets.filter((date) => isThisWeek(date.PurchaseDate) == true)

        //Calculate weekly amount
        let amount = 0;
        weekBudget.forEach(budget => {
            amount += budget.ItemAmount
        })

        setWeeklyTotal(amount)
        setAll(false)
        setWeekBudgets(weekBudget)
        setBudgetItems(weekBudget)
    }

    const allPurchases = (event) => {
        setAll(true)
        setBudgetItems(nonFiltered)
    }

    return (
        <div className="base-content">
            <Sidebar budget_id={p_budgetId}></Sidebar>
            <PurchaseForm budget_id={p_budgetId} show={show} setShow={setShow}></PurchaseForm>
            <div className="budget-display">
                <div className="budget-header">
                    {/*left header*/}
                    <div className="budget-header-right">
                        <a style={{ backgroundColor: "white" }} className="budget-header-item">{p_budget.BudgetName}</a>
                        <a className="budget-header-item mobile-hide">Weekly total: &#163;{weeklyTotal}</a>
                        <a className="budget-header-item mobile-hide">Weekly target: &#163;{!p_budget.WeeklyAmount ? 0 : p_budget.WeeklyAmount.toFixed(2)}</a>
                    </div>
                    {/*right header*/}
                    <div className="budget-header-right">
                        <button className="budget-header-item" onClick={handleShow}>Add Purchase</button>
                    </div>
                </div>
                <div className="budget-box">
                    <div className="budget-title-header">
                        <label className={All ? "budget-nav-title" : "budget-nav-title-selected"} onClick={currentWeek}>Current week</label>
                        <label className={!All ? "budget-nav-title" : "budget-nav-title-selected"} onClick={allPurchases}>All Purchases</label>
                    </div>
                    <div className="budget-content">
                        {loading ? <div className="no-budgets"><Spinner animation="border" variant="info" role="status"></Spinner></div> : <></>}
                        {!budgetItems ? <div className={loading ? "budgets-loading" : "no-budgets"}>No Purchases</div> : budgetItems.map(budgetItem => (<BudgetItemColumn budgetItem={budgetItem} key={budgetItem.Id} />))}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default BudgetDisplay