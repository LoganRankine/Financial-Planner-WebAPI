import React, { Children, Component, useState, useEffect } from 'react';
import './Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import './AccountHomepage.css'

import BudgetListColumn from './BudgetListColumn'



function Homepage() {

    const [allBudgets, setBudgets] = useState(null);

    const getAllBudgets = async (event) => {
        const myHeaders = new Headers();
        myHeaders.append("x-api-key", "139b5da0-84c9-4ebf-9a5b-d1494a80dc6e")

        let budgetsRequest = await fetch("https://localhost:7073/api/Budget/AllBudgets",
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        )

        let response = await budgetsRequest.json();
        let budgetList = JSON.parse(response);

        setBudgets(budgetList)

        console.log(response);
        console.log(budgetList);
    }

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("x-api-key", "139b5da0-84c9-4ebf-9a5b-d1494a80dc6e")

        fetch("https://localhost:7073/api/Budget/AllBudgets",
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => response.json()).then(data => {
            const temp = JSON.parse(data)
            console.log(temp)
            setBudgets(temp)
        });
    }, []);


    return (
        <div className="page">
            <header className="top-navbar">
                {/*Section to show name and logo*/}
                <div className="title-box">
                    {/*Logo*/}
                    <span class="material-symbols-outlined top-navbar-logo">
                        account_balance
                    </span>
                    {/*Name*/}
                    <a className="top-navbar-name">Financial Planner by Logan</a>
                </div>
            </header>
            <div className="account-content">
                <div className="sidebar">
                    <div>
                        <div className="navbar-item">
                            <span id="icon" class="material-symbols-outlined">add</span>
                            <a id="nav-title">New Budget</a>
                        </div>
                        <div className="navbar-item">
                            <span id="icon" class="material-symbols-outlined">menu_book</span>
                            <a onClick={getAllBudgets} id="nav-title">Budgets</a>
                        </div>

                    </div>
                    <div>
                        <div id="bottom-navbar" className="navbar-item">
                            <span id="icon" class="material-symbols-outlined">settings</span>
                            <a id="nav-title">Account Settings</a>
                        </div>

                    </div>
                </div>
                <div className="content-area">
                    <div className="list">
                        <div className="list-header">
                            <div className="list-header-item">Budget Name</div>
                            <div className="list-header-item">Start Date</div>
                            <div className="list-header-item">End Date</div>
                            <div className="list-header-item">Total Amount</div>
                            <div className="list-header-item">Weekly Amount</div>
                        </div>
                        <div className="list-content">
                            {!allBudgets ? 'Loading' : <BudgetListColumn budgets={allBudgets} />}
                            <div className="list-content-column">
                                <div className="list-content-item">the first budget</div>
                                <div className="list-content-item">16/12/2023</div>
                                <div className="list-content-item">16/03/2024</div>
                                <div className="list-content-item">£3245.89</div>
                                <div className="list-content-item">£79.65</div>
                                <div className="list-content-option">
                                    <span class="material-symbols-outlined">edit</span>
                                    <span class="material-symbols-outlined">delete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage