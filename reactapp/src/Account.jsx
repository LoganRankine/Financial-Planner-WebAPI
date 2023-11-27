import React, { Children, Component, useState } from 'react';
import './Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

export default class Account extends Component {
    static displayName = "Budget";
    constructor(props) {
        super(props);
        this.state = { isBudgetDetail: true  };
    }


    render() {
        const [isActive, setIsActive] = useState(false);

        let budgetStyle = {
        };
        let debitStyle = {
        };

        if (this.state.isBudgetDetail) {
            budgetStyle = { color: "grey"}
        }
        else {
            debitStyle = { color: "grey" }

        }

        return (
            <div class="flex-container">
                <div class="account-creation-container">
                    <div class="account-creation-header">
                        <div class="account-creation-title-box">
                            <a id="title">Create your first Budget</a>
                        </div>
                        <div class="account-creation-nav-box">
                            <a style={budgetStyle} class="account-creation-nav-item" onClick={() => { this.setState({ isBudgetDetail: true }) }}>Budget Details</a>
                            <a style={debitStyle} class="account-creation-nav-item" onClick={() => { this.setState({ isBudgetDetail: false }) }}>Direct Debits</a>
                        </div>
                    </div>
                </div>

                {/*    {*/}
                {/*        (() => {*/}
                {/*            if (this.state.isBudgetDetail) {*/}
                {/*                return (*/}
                {/*                    <this.BudgetDetail></this.BudgetDetail>*/}
                {/*                )*/}
                {/*            } else {*/}
                {/*                return (*/}
                {/*                    <this.DirectDebits></this.DirectDebits>*/}
                {/*                )*/}
                {/*            }*/}
                {/*        })()*/}
                {/*    }*/}
                </div>
        );
    }

    //DirectDebits() {
    //    const [directDebitName, setDirectDebitName] = useState("");
    //    const [paymentDate, setPaymentDate] = useState("");
    //    const [interval, setInterval] = useState("");
    //    const [directDebitAmount, setDebitAmount] = useState("");

    //    const cars = ['Ford', 'BMW', 'Audi', 'Vauxhaul', 'Renault', 'SEAT'];

    //    const Column = (props) => {
    //        return (
    //            <div class="debit-detail-column">
    //                <div class="debit-column-left">
    //                    <a id="debit-name-title">{props.name}</a>
    //                    <a id="debit-due-title">due date</a>
    //                </div>
    //                <div class="debit-column-right">
    //                    <a id="debit-amount">due</a>
    //                    <span id="debit-action-button" class="material-symbols-outlined">
    //                        delete
    //                    </span>

    //                </div>
    //            </div>
    //        );
    //    }

    //    return (
    //        <div class="account-creation-content">
    //            <div class="debit-creation-content">
    //                <div class="debit-detail-input">
    //                    <div class="input-container">
    //                        <label>Direct Debit Name</label><br />
    //                        <input type="text" value={directDebitName}
    //                            onChange={(e) => setDirectDebitName(e.target.value)}
    //                            class="input-box" />
    //                    </div>
    //                    <div class="input-container">
    //                        <label>Payment Date</label><br />
    //                        <input type="date" value={paymentDate}
    //                            onChange={(e) => setPaymentDate(e.target.value)}
    //                            class="input-box" />
    //                    </div>
    //                    <div class="input-container">
    //                        <label>Interval</label><br />
    //                        <input type="date" value={interval}
    //                            onChange={(e) => setInterval(e.target.value)}
    //                            class="input-box" />
    //                    </div>
    //                    <div class="input-container">
    //                        <label>Amount</label><br />
    //                        <input type="number" value={directDebitAmount}
    //                            onChange={(e) => setDebitAmount(e.target.value)}
    //                            class="input-box" />
    //                    </div>
    //                </div>
    //                <div class="debit-details-display">
    //                    {cars.map((car) => <Column name={car} />)}
    //                </div>
    //            </div>
    //            <div>
    //                <div class="account-creation-footer">
    //                    <div>
    //                        <button title="Save budget details and continue to main page" class="positive-button">Save Budget</button>
    //                        <button title="Save budget details and add direct debits" class="positive-button">Add Direct Debit</button>
    //                    </div>
    //                    <div>
    //                        <button title="Skip first budget creation" class="negative-button">Skip</button>
    //                    </div>
    //                </div>
    //            </div>
    //        </div>
    //    );
    //}

    //BudgetDetail() {
    //    const [budgetDetail, setBudgetDetail] = useState("isBudgetDetail");
    //    const [cookies, setCookie] = useCookies(['SessionID']);
    //    const [budgetName, setBudgetName] = useState("");
    //    const [startDate, setStartDate] = useState("");
    //    const [endDate, setEndDate] = useState("");
    //    const [budgetAmount, setBudgetAmount] = useState("");

    //    const saveBudget = async (event) => {
    //        const createBudget = {
    //            BudgetName: budgetName,
    //            BudgetAmount: budgetAmount,
    //            StartDate: startDate,
    //            EndDate: endDate,
    //        }
    //        console.log("Add inputs to JSON object", createBudget)

    //        //Send data to create budget
    //        let sessionId = cookies.SessionID
    //        console.log(sessionId)

    //        const myHeaders = new Headers();
    //        myHeaders.append("x-api-key", sessionId)

    //        let createUserRequest = await fetch("https://localhost:7073/api/Budget/CreateBudget",
    //            {
    //                method: 'POST', body: JSON.stringify(createBudget),
    //                mode: 'cors',
    //                headers: myHeaders,
    //            }
    //        )

    //        let response = await createUserRequest.json();


    //        if (createUserRequest.ok) {
    //            try {
    //                //Get BudgetId from response
    //                const budgetObject = JSON.parse(response)
    //                sessionStorage.setItem("BudgetId", budgetObject.BudgetId)
    //                console.log(budgetObject.BudgetName, "created, budgetID added to session storage")
    //                console.log(this.state.isBudgetDetail)
    //                return false;
    //            }
    //            catch (err) {
    //                console.error(err)
    //                return false;
    //            }
    //        }
    //        return false;
    //    }
    //    return (
    //        <div class="account-creation-content">
    //            <div class="input-container">
    //                <label>Budget Name</label><br />
    //                <input type="text" value={budgetName}
    //                    onChange={(e) => setBudgetName(e.target.value)}
    //                    class="input-box" />
    //            </div>
    //            <div class="input-container">
    //                <label>Start Date</label><br />
    //                <input type="date" value={startDate}
    //                    onChange={(e) => setStartDate(e.target.value)}
    //                    class="input-box" />
    //            </div>
    //            <div class="input-container">
    //                <label>End Date</label><br />
    //                <input type="date" value={endDate}
    //                    onChange={(e) => setEndDate(e.target.value)}
    //                    class="input-box" />
    //            </div>
    //            <div class="input-container">
    //                <label>Total Budget Amount</label><br />
    //                <input type="number" value={budgetAmount}
    //                    onChange={(e) => setBudgetAmount(e.target.value)}
    //                    class="input-box" />
    //            </div>
    //            <div class="account-creation-footer">
    //                <div>
    //                    <button title="Save budget details and continue to main page" class="positive-button" onClick={() =>
    //                    {
    //                        if (saveBudget) {
    //                        }
    //                        else {
                                
    //                        }
    //                        }
    //                    }>Save Budget</button>
    //                    <button title="Save budget details and add direct debits" class="positive-button">Add Direct Debit</button>
    //                </div>
    //                <div>
    //                    <button title="Skip first budget creation" class="negative-button">Skip</button>
    //                </div>
    //            </div>
    //        </div>
    //    );
    //}  

}
