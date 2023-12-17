import React, { Children, Component, useState } from 'react';
import './Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import './AccountHomepage.css'



function BudgetListColumn(budgets) {

    return budgets.budgets.map(budget => (
        <div className="list-content-column">
            <div className="list-content-item">{budget.BudgetName}</div>
            <div className="list-content-item">{budget.StartDate.toString("YYYY-MM-DD")}</div>
            <div className="list-content-item">{budget.EndDate}</div>
            <div className="list-content-item">{budget.BudgetAmount}</div>
            <div className="list-content-item"></div>
            <div className="list-content-option">
                <span class="material-symbols-outlined">edit</span>
                <span class="material-symbols-outlined">delete</span>
            </div>
        </div>
    ));
}

export default BudgetListColumn