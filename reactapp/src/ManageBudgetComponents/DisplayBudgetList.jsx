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
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col" >Budget Name</th>
                            <th scope="col" >Start Date</th>
                            <th scope="col" >End Date</th>
                            <th scope="col" >Available Amount</th>
                            <th scope="col" >Weekly Amount</th>
                            <th scope="col" >Actions</th>
                            <th scope="col" className="list-content-option">
                                <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>
                                    refresh
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-striped table-hover">
                            {loading ? <div className="no-budgets"><Spinner animation="border" variant="info" role="status"></Spinner></div> : <></>}
                        {!allBudgets ? <div className={loading ? "budgets-loading" : "no-budgets"}>No Budgets</div> : allBudgets.map(budget => (<BudgetListColumn budget={budget} key={budget.Id} refresh={refreshBudgets} />))}
                        {/*{!allBudgets ? 'Loading' : allBudgets.allBudgets.map}*/}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default DisplayBudgets