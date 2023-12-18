import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/Budget.css'

import BudgetItemColumn from './BudgetItemColumn'



function BudgetDisplay() {
    const [cookies, setCookie] = useCookies(['SessionID']);
    return (
        <div className="budget-display">
            <div className="budget-header">
                {/*left header*/}
                <div className="budget-header-right">
                    <a className="budget-header-item">Weekly total: </a>
                    <a className="budget-header-item">Weekly target: </a>
                </div>
                {/*right header*/}
                <div className="budget-header-right">
                    <button>Add Purchase</button>
                </div>
            </div>
            <div className="budget-content">
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
                <BudgetItemColumn></BudgetItemColumn>
            </div>
        </div>
    );
}

export default BudgetDisplay