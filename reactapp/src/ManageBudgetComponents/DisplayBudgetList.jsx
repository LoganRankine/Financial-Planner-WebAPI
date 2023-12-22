import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/AccountHomepage.css'

import BudgetListColumn from './BudgetListColumn'



function DisplayBudgets({SideBar }) {
    const [cookies, setCookie] = useCookies(['SessionID']);

    const [allBudgets, setBudgets] = useState(null);

    useEffect(() => {
        let sessionId = cookies.SessionID

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)
        fetch("https://localhost:7073/api/Budget/AllBudgets",
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => response.json()).then(data => {
            const temp = JSON.parse(data)
            console.log(temp)
            setBudgets(temp)
        });
    }, []);


    return (
        <div className="base-content">
            {SideBar}
            <div className="content-area">
                <div className="list">
                    <div className="list-header">
                        <div className="list-header-item">Budget Name</div>
                        <div className="list-header-item">Start Date</div>
                        <div className="list-header-item">End Date</div>
                        <div className="list-header-item">Total Amount</div>
                        <div className="list-header-item">Weekly Amount</div>
                        <div className="list-content-option"></div>
                    </div>
                    <div className="list-content">
                        {!allBudgets ? 'Loading' : allBudgets.map(budget => (< BudgetListColumn budgets={budget} />))}
                        {/*{!allBudgets ? 'Loading' : allBudgets.allBudgets.map}*/}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DisplayBudgets