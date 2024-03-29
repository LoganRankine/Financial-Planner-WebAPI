import React, { Children, Component, useState } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import Sidebar from '../AccountComponents/BudgetSidebar';
import serverConfig from "../../server-config.json"
import CreateBudget from './CreateBudget'
import CreateDebit from '../ManageDebitComponents/CreateDebit'

function ManageBudget({ child }) {

    const [budget, setBudget] = useState(false);

    let budgetStyle = {
    };
    let debitStyle = {
    };

    if (window.location.pathname === "/Account/CreateBudget") {
        budgetStyle = { color: "grey" }

    }
    else {
        debitStyle = { color: "grey" }
    }
    console.log(budget)

    return (
        <div className="base-content">
            {Sidebar}
            <div className="content-area">
                <div class="flex-container">
                    <div class="account-creation-container">
                        <div class="account-creation-header">
                            <div class="account-creation-title-box">
                                <a id="title">Create your first Budget</a>
                            </div>
                            <div class="account-creation-nav-box">
                                <Link to="/Account/CreateBudget" style={budgetStyle} class="account-creation-nav-item">Budget Details</Link>
                                <Link to="/Account/ManageBudget/CreateDebit" style={debitStyle} class="account-creation-nav-item">Direct Debits</Link>
                            </div>
                        </div>
                        {budget ? <CreateDebit></CreateDebit> : <CreateBudget></CreateBudget>}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ManageBudget