import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import '../css/AccountHomepage.css'

import BudgetListColumn from './BudgetListColumn'
import serverConfig from "../../server-config.json"
import Spinner from 'react-bootstrap/Spinner';

function DisplayBudgets({SideBar }) {
    const [cookies, setCookie] = useCookies(['SessionID']);
    const [loading, setLoading] = useState(true);
    const [fetchBudgets, setFetchBudgets] = useState(false);

    const [allBudgets, setBudgets] = useState(null);

    const refreshBudgets = () => setFetchBudgets(true);

    const loadBudgets = () => {
        setLoading(true)
        let sessionId = cookies.SessionID

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)
        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/Budget/AllBudgets`,
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => {
            if (response.status == 200) {
                response.json().then(data => {
                    const temp = JSON.parse(data)
                    console.log(temp)
                    setBudgets(temp)
                    setLoading(false)
                })
            }
            else if (response.status == 204) {
                setLoading(false)
            }
        })

    }

    useEffect(() => {
        loadBudgets()

        //Once refreshed, ensure variable set to false so action can happen again
        setFetchBudgets(false)
    }, [fetchBudgets]);

    return (
        <div className="base-content">
            {SideBar}
            <div className="content-area">
                <div className="list">
                    <div className="list-header">
                        <div className="list-header-item">Budget Name</div>
                        <div className="list-header-item">Start Date</div>
                        <div className="list-header-item">End Date</div>
                        <div className="list-header-item">Available Amount</div>
                        <div className="list-header-item">Weekly Amount</div>
                        <div className="list-content-option">
                            <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>
                                refresh
                            </span>
                        </div>
                    </div>
                    <div className="list-content">
                        {loading ? <div className="no-budgets"><Spinner animation="border" variant="info" role="status"></Spinner></div> : <></>}
                        {!allBudgets ? <div className={loading ? "budgets-loading" : "no-budgets"}>No Budgets</div> : allBudgets.map(budget => (<BudgetListColumn budget={budget} key={budget.Id} refresh={refreshBudgets} />))}
                        {/*{!allBudgets ? 'Loading' : allBudgets.allBudgets.map}*/}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DisplayBudgets