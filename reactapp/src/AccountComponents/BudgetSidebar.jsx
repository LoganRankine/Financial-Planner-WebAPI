import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/AccountHomepage.css'

function Sidebar({ budget_id }) {
    const [home, setHome] = useState(false);
    const [purchase, setPurchase] = useState(false);
    const [debit, setDebit] = useState(false);

    const handlePurchase = async () => {
        if (!purchase) {
            setPurchase(true)
        }
        else {
            setDebit(false)
            setHome(false)
        }
    }
    const handleHome = async () => {
        if (!home) {
            setHome(true)
        }
        else {
            setDebit(false)
            setPurchase(false)
        }
    }
    const handleDebit = async () => {
        if (!debit) {
            setDebit(true)
        }
        else {
            setHome(false)
            setPurchase(false)
        }
    }

    return (
        <div className="sidebar">
            <div className="budget-navbar">
                <Link className="navbar-item" to="/Account/Home">
                    <span id="icon" class="material-symbols-outlined">home</span>
                    <a id="nav-title">Home</a>
                </Link>
                <Link className="navbar-item" to={`/Account/Display/Budget/budget_id=${budget_id}`}>
                    <span id="icon" class="material-symbols-outlined">shopping_cart</span>
                    <a id="nav-title">Purchases</a>
                </Link>
                <Link className="navbar-item" to={`/Account/Display/DirectDebits/budget_id=${budget_id}`}>
                    <span id="icon" class="material-symbols-outlined">payments</span>
                    <a id="nav-title">Direct Debit</a>
                </Link>
                <Link className="navbar-item mobile-hide" to="/Account/Home">
                    <span id="icon" class="material-symbols-outlined">savings</span>
                    <a id="nav-title">Savings</a>
                </Link>

            </div>
            <div className="mobile-hide">
                <div id="bottom-navbar" className="navbar-item">
                    <span id="icon" class="material-symbols-outlined">settings</span>
                    <a id="nav-title">Budget Settings</a>
                </div>
            </div>
        </div>
    );
}

export default Sidebar