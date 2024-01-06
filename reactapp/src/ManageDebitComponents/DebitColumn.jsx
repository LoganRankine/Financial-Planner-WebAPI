import React, { Children, Component, useState, useEffect } from 'react';
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import '../css/Budget.css'

function DebitColumn({directDebit }) {

    const [debitId, setDebitId] = useState("");
    const [formatedDueDate, setFormattedDueDate] = useState("");
    useEffect(() => {
        setDebitId(directDebit.DebitId)
        var dueDate = new Date(directDebit.DebitDate)

        let date = format(dueDate, "EEEE do LLLL yyyy")
        setFormattedDueDate(`${date}`)

    }, []);

    return (
        <div className="debit-content-item">
            <div className="debit-item-box">
                <div className="debit-item-left">
                    <a className="debit-item-title">{directDebit.DebitName}</a>
                    <div className="debit-item-left-box">
                        <div>
                            <a className="debit-item-date">Due: {formatedDueDate}</a>

                        </div>
                        <div>
                            <a id="debit-item-frequency" className="debit-item-date">Every {directDebit.Frequency} days</a>
                        </div>
                    </div>
                </div>
                <div className="debit-item-right">
                    <a className="debit-item-price">&#163;{directDebit.DebitAmount}</a>
                    <div className="list-content-option">
                        <span class="material-symbols-outlined">edit</span>
                        <span id="delete-icon" class="material-symbols-outlined">delete</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DebitColumn