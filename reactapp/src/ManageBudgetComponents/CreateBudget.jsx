import React, { Children, Component, useState } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

function CreateBudget() {
        const [cookies, setCookie] = useCookies(['SessionID']);
        const [budgetName, setBudgetName] = useState("");
        const [startDate, setStartDate] = useState("");
        const [endDate, setEndDate] = useState("");
        const [budgetAmount, setBudgetAmount] = useState("");

        const saveBudget = async (event) => {
            const createBudget = {
                BudgetName: budgetName,
                AvailableAmount: budgetAmount,
                StartDate: startDate,
                EndDate: endDate,
            }
            console.log("Add inputs to JSON object", createBudget)

            //Send data to create budget
            let sessionId = cookies.SessionID
            console.log(sessionId)

            const myHeaders = new Headers();
            myHeaders.append("x-api-key", sessionId)

            let createUserRequest = await fetch("https://localhost:7073/api/Budget/CreateBudget",
                {
                    method: 'POST', body: JSON.stringify(createBudget),
                    mode: 'cors',
                    headers: myHeaders,
                }
            )

            let response = await createUserRequest.json();


            if (createUserRequest.ok) {
                try {
                    //Get BudgetId from response
                    const budgetObject = JSON.parse(response)
                    sessionStorage.setItem("BudgetId", budgetObject.BudgetId)
                    console.log(budgetObject.BudgetName, "created, budgetID added to session storage")
                    console.log(this.state.isBudgetDetail)
                    return false;
                }
                catch (err) {
                    console.error(err)
                    return false;
                }
            }
            return false;
        }
        return (
            <div class="account-creation-content">
                <div class="input-container">
                    <label>Budget Name</label><br />
                    <input type="text" value={budgetName}
                        onChange={(e) => setBudgetName(e.target.value)}
                        class="input-box" />
                </div>
                <div class="input-container">
                    <label>Start Date</label><br />
                    <input type="datetime-local" value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        class="input-box" />
                </div>
                <div class="input-container">
                    <label>End Date</label><br />
                    <input type="datetime-local" value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        class="input-box" />
                </div>
                <div class="input-container">
                    <label>Total Budget Amount</label><br />
                    <input type="number" value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        class="input-box" />
                </div>
                <div class="account-creation-footer">
                    <div>
                        <button title="Save budget details and continue to main page" class="positive-button" onClick={saveBudget}>Save Budget</button>
                        <button title="Save budget details and add direct debits" class="positive-button">Add Direct Debit</button>
                    </div>
                    <div>
                        <button title="Skip first budget creation" class="negative-button">Skip</button>
                    </div>
                </div>
            </div>
        );
}
export default CreateBudget