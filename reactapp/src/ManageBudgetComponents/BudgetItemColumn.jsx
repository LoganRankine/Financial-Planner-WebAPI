import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import '../css/Budget.css'
function BudgetItemColumn(budgetItem) {
    const [itemId, setItemId] = useState("");
    const [formattedPurchaseDate, setFormattedPurchaseDate] = useState("");
    useEffect(() => {
        setItemId(budgetItem.budgetItem.ItemId)
        var purchaseDate = new Date(budgetItem.budgetItem.PurchaseDate)

        let date = format(purchaseDate, "EEEE do LLLL yyyy")
        let time = format(purchaseDate, "p")
        setFormattedPurchaseDate(`${date} at ${time}`)

    }, []);

    return (
        <div className="budget-content-item">
            <div className="budget-item-box">
                <div className="budget-item-left">
                    <a className="budget-item-title">{budgetItem.budgetItem.ItemName}</a>
                    <a className="budget-item-date">{formattedPurchaseDate} </a>
                </div>
                <div className="budget-item-right">
                    <a className="budget-item-price">&#163;{budgetItem.budgetItem.ItemAmount}</a>
                    <div className="list-content-option">
                        <span class="material-symbols-outlined">edit</span>
                        <span id="delete-icon" class="material-symbols-outlined">delete</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BudgetItemColumn