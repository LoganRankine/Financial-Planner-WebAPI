import React, { Component, useState } from 'react';
import './Account.css'
import { CookiesProvider, useCookies } from "react-cookie";

export default class Account extends Component {
    static displayName = "Budget";
    constructor(props) {
        super(props);
        this.state = { isBudgetDetail: true  };
    }

    render() {
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
                    {
                        (() => {
                            if (this.state.isBudgetDetail) {
                                return (
                                    <this.BudgetDetail></this.BudgetDetail>
                                )
                            } else {
                                return (
                                    <this.DirectDebits></this.DirectDebits>
                                )
                            }
                        })()
                    }
                </div>
            </div>
        );
    }

    BudgetDetail() {

        const [cookies, setCookie] = useCookies();
        const [budgetName, setBudgetName] = useState("");
        const [startDate, setStartDate] = useState("");
        const [endDate, setEndDate] = useState("");
        const [budgetAmount, setBudgetAmount] = useState("");

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
                    <input type="date" value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        class="input-box" />
                </div>
                <div class="input-container">
                    <label>End Date</label><br />
                    <input type="date" value={endDate}
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
                        <button title="Save budget details and continue to main page" class="positive-button">Save Budget</button>
                        <button title="Save budget details and add direct debits" class="positive-button">Add Direct Debit</button>
                    </div>
                    <div>
                        <button title="Skip first budget creation" class="negative-button">Skip</button>
                    </div>
                </div>
            </div>
        );
    }

    DirectDebits() {
        return (
            <p>Hello Direct Debits!</p>
        );
    }

}
