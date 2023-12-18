import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/Budget.css'
function BudgetItemColumn() {
    const [cookies, setCookie] = useCookies(['SessionID']);
    return (
        <div className="budget-content-item">
            <div className="budget-item-box">
                <div className="budget-item-left">
                    <a className="budget-item-title">Beans and Burger</a>
                    <a className="budget-item-date">Tuesday 12th March 2024 at 19:06 </a>
                </div>
                <div className="budget-item-right">
                    <a className="budget-item-price">45.99</a>
                    <div className="list-content-option">
                        <span class="material-symbols-outlined">edit</span>
                        <span class="material-symbols-outlined">delete</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BudgetItemColumn