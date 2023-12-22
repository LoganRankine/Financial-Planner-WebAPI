import React, { Children, Component, useState } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

function CreateDebitForm({ budget_id }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [directDebitName, setDirectDebitName] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [interval, setInterval] = useState("");
    const [directDebitAmount, setDebitAmount] = useState("");

    //Add direct debits
    const saveDebit = async (event) => {
        const budgetId = budget_id

        const createDebit = {
            BudgetId: budgetId,
            DebitName: directDebitName,
            DebitAmount: directDebitAmount,
            DebitDate: paymentDate,
            Frequency: interval
        }
        console.log("Add inputs to JSON object", createDebit)

        //Send data to create budget
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        let createUserRequest = await fetch("https://localhost:7073/api/DirectDebit/CreateDebit",
            {
                method: 'POST', body: JSON.stringify(createDebit),
                mode: 'cors',
                headers: myHeaders,
            }
        )
        if (createUserRequest.ok) {
            console.log("added direct debit successfully")
        }
    }

    return (
        <div class="account-creation-content">
            <div class="debit-creation-content">
                <div class="debit-detail-input">
                    <div class="input-container">
                        <label>Direct Debit Name</label><br />
                        <input type="text" value={directDebitName}
                            onChange={(e) => setDirectDebitName(e.target.value)}
                            class="input-box" />
                    </div>
                    <div class="input-container">
                        <label>Payment Date</label><br />
                        <input type="date" value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            class="input-box" />
                    </div>
                    <div class="input-container">
                        <label>Interval</label><br />
                        <input type="number" value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            class="input-box" />
                    </div>
                    <div class="input-container">
                        <label>Amount</label><br />
                        <input type="number" value={directDebitAmount}
                            onChange={(e) => setDebitAmount(e.target.value)}
                            class="input-box" />
                    </div>
                </div>
            </div>
            <div>
                <div class="account-creation-footer">
                    <div>
                    </div>
                    <div>
                        <button onClick={saveDebit} title="Save budget details and add direct debits" class="positive-button">Add Direct Debit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateDebitForm