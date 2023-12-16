import React, { Children, Component, useState } from 'react';
import './Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import './AccountHomepage.css'



function Homepage() {

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
                    <div className="navbar-item">
                        <span id="icon" class="material-symbols-outlined">add</span>
                        <a id="nav-title">New Budget</a>
                    </div>
                    <div className="navbar-item">
                        <span id="icon" class="material-symbols-outlined">menu_book</span>
                        <a id="nav-title">Budgets</a>
                    </div>
                    <div id="bottom-navbar" className="navbar-item">
                        <span id="icon" class="material-symbols-outlined">settings</span>
                        <a id="nav-title">Account Settings</a>
                    </div>
                </div>
                <div className="content-area">
                    display stuff here...
                </div>
            </div>
        </div>
    );
}

export default Homepage