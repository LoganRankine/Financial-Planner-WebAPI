import React, { Children, Component, useState, useEffect } from 'react';
import { format } from "date-fns";

import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/AccountHomepage.css'



function BudgetListColumn(budgets) {
    const [budgetId, setBudgetId] = useState("");
    const [formattedStartDate, setformattedStartDate] = useState("");
    const [formattedEndDate, setformattedEndDate] = useState("");
    useEffect(() => {
        setBudgetId(budgets.budgets.BudgetId)
        var startDate = new Date(budgets.budgets.StartDate)
        var endDate = new Date(budgets.budgets.EndDate)
        setformattedStartDate(format(startDate, "dd-MM-yyyy"))
        setformattedEndDate(format(endDate, "dd-MM-yyyy"))

    }, []);
    const getBudgetId = async (event) => {
        console.log(budgetId)
    }
    const directBudget = async (event) => {
        window.location.href = `/Account/Display/Budget/budget_id=${budgetId}`
    }
    return (
        <div className="list-content-column" >
            <div className="list-content-item" onClick={directBudget}>{budgets.budgets.BudgetName}</div>
            <div className="list-content-item" onClick={directBudget}>{formattedStartDate}</div>
            <div className="list-content-item" onClick={directBudget}>{formattedEndDate}</div>
            <div className="list-content-item" onClick={directBudget}>&#163;{budgets.budgets.BudgetAmount.toFixed(2)}</div>
            <div className="list-content-item">&#163;{budgets.budgets.WeeklyAmount.toFixed(2)}</div>
            <div className="list-content-option">
                <span class="material-symbols-outlined" onClick={getBudgetId}>edit</span>
                <span class="material-symbols-outlined">delete</span>
            </div>
        </div>
    );
}

export default BudgetListColumn