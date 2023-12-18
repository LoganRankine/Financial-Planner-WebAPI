import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/AccountHomepage.css'

function Sidebar() {
    return (
        <div className="sidebar">
            <div>
                <Link className="navbar-item" to="/Account/CreateBudget">
                    <span id="icon" class="material-symbols-outlined">shopping_cart</span>
                    <a id="nav-title">Budget</a>
                </Link>
                <Link className="navbar-item" to="/Account/Home">
                    <span id="icon" class="material-symbols-outlined">payments</span>
                    <a id="nav-title">Direct Debit</a>
                </Link>
                <Link className="navbar-item" to="/Account/Home">
                    <span id="icon" class="material-symbols-outlined">savings</span>
                    <a id="nav-title">Savings</a>
                </Link>

            </div>
            <div>
                <div id="bottom-navbar" className="navbar-item">
                    <span id="icon" class="material-symbols-outlined">settings</span>
                    <a id="nav-title">Budget Settings</a>
                </div>
            </div>
        </div>
    );
}

export default Sidebar