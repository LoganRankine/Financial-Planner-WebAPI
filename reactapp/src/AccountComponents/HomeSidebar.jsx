import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import '../css/AccountHomepage.css'
import { Link } from "react-router-dom";


import DisplayBudgetList from '../ManageBudgetComponents/DisplayBudgetList'



function DisplayBudgetsSidebar() {

    return (
        <div className="sidebar">
            <div>
                <Link className="navbar-item" to="/Account/CreateBudget">
                    <span id="icon" class="material-symbols-outlined">add</span>
                    <a id="nav-title">New Budget</a>
                {/*    <Link id="nav-title" to="/Account/CreateBudget">New Budget</Link>*/}
                </Link>
                <Link className="navbar-item" to="/Account/Home">
                    <span id="icon" class="material-symbols-outlined">menu_book</span>
                    <a id="nav-title">Budgets</a>
                {/*    <Link id="nav-title" to="/Account/Home">Budgets</Link>*/}
                </Link>

            </div>
            <div>
                <div id="bottom-navbar" className="navbar-item">
                    <span id="icon" class="material-symbols-outlined">settings</span>
                    <a id="nav-title">Account Settings</a>
                </div>
            </div>
        </div>
    );
}

export default DisplayBudgetsSidebar