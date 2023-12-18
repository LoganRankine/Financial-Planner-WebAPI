import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/AccountHomepage.css'

function Homepage({ Sidebar, Content }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [allBudgets, setBudgets] = useState(null);

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
                {/*Display Sidebar*/}
                {Sidebar}
                {Content}
            </div>
        </div>
    );
}

export default Homepage