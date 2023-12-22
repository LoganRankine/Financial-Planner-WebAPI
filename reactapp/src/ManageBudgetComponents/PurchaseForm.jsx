import React, { Children, Component, useState } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import Alert from 'react-bootstrap/Alert';

function PurchaseForm(budget_id) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [itemName, setItemName] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [itemAmount, setItemAmount] = useState("");
    //const budgetId = "3266cb34-223b-42d7-9380-59cae4d587d2"

    console.log("This window is purchase form, budgetId is:", budget_id.budget_id)
    const addPurchase = async (event) => {
        const createPurchase = {
            BudgetId: budget_id.budget_id,
            ItemName: itemName,
            ItemAmount: itemAmount,
            PurchaseDate: purchaseDate,
        }
        console.log("Add inputs to JSON object", createPurchase)

        //Send data to create budget
        let sessionId = cookies.SessionID
        console.log(sessionId)

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        let createPurchaseRequest = await fetch("https://localhost:7073/api/Budget/CreateBudgetItem",
            {
                method: 'POST', body: JSON.stringify(createPurchase),
                mode: 'cors',
                headers: myHeaders,
            }
        )

        let response = await createPurchaseRequest.json();

        if (createPurchaseRequest.ok) {
            try {
                //Get BudgetId from response
                const BudgetItemObject = JSON.parse(response)
                console.log(BudgetItemObject)
                //sessionStorage.setItem("BudgetId", budgetObject.BudgetId)
                //console.log(budgetObject.BudgetName, "created, budgetID added to session storage")
                //console.log(this.state.isBudgetDetail)
            }
            catch (err) {
                console.error(err)
            }
        }
    }

    return (
        <div class="purchase-creation-content">
            <div class="input-container">
                <label>Purchase Name</label><br />
                <input type="text" value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    class="input-box" />
            </div>
            <div class="input-container">
                <label>Purchase Date</label><br />
                <input type="datetime-local" value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    class="input-box" />
            </div>
            <div class="input-container">
                <label>Purchase Amount</label><br />
                <input type="number" value={itemAmount}
                    onChange={(e) => setItemAmount(e.target.value)}
                    class="input-box" />
            </div>
            <div class="account-creation-footer">
                <div>
                </div>
                <div>
                    <button title="Save budget details and continue to main page" class="positive-button" onClick={addPurchase}>Add Purchase</button>
                </div>
            </div>
        </div>
    );
}
export default PurchaseForm