import React, { Component, useState, useEffect } from 'react';
import './css/App.css';
import { CookiesProvider, useCookies } from "react-cookie";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import FirstPage from './FirstPage'
import Login from './UserAuthentificationComponents/LogInForm'
import Register from './UserAuthentificationComponents/RegisterForm'
import manageBudget from './ManageBudgetComponents/ManageBudget'
import CreateBudget from './ManageBudgetComponents/CreateBudget'
import CreateDebit from './ManageDebitComponents/CreateDebit'
import ManageBudget from './ManageBudgetComponents/ManageBudget';
import AccountHomepage from './AccountComponents/AccountHomepage';
import DisplayBudgetList from './ManageBudgetComponents/DisplayBudgetList'
import DisplayBudgetsSidebar from './AccountComponents/HomeSidebar'
import BudgetSidebar from './AccountComponents/BudgetSidebar'
import BudgetDisplay from './ManageBudgetComponents/BudgetDisplay'
import DirectDebitDisplay from './ManageDebitComponents/DirectDebitsDisplay'
import LoginDisplay from './UserAuthentificationComponents/LoginDisplay'
import NotFound from './NotFoundComponents/PageNotFound'
import NotAuthorised from './NotFoundComponents/NotAuthorised'
import Loading from './NotFoundComponents/Loading'
import serverConfig from "../server-config.json"


export default class App extends Component {
    static displayName = App.name;
    constructor(props) {
        super(props);
        this.state = { forecasts: [], loading: true, isLogin: true, authorised: false };
    }

    componentDidMount() {
        
        this.Authenticate();
    }

    async Authenticate() {
        //check session storage for auth
        let sessionId = sessionStorage.getItem("SessionID")

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)

        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/user/CheckAuthStatus`,
            {
                method: 'get',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => {
            if (response.status == 200) {
                response.json().then(data => {
                    console.log(data)
                    this.setState({ authorised: true, loading: false });
                })

            }
            else {
                this.setState({loading: false });
                console.log("user not authenticated")
            }
        })

    }


    render() {
        if (this.state.loading) {
            return (<Loading></Loading>);
        }
        else {
            return (
                <Router>
                    <Routes>
                        {this.state.authorised ?
                            <>
                                <Route exact path="/" element={<FirstPage child={<Login />} />}></Route>
                                <Route exact path="/Register" element={<FirstPage child={<Register />} />}></Route>
                                <Route exact path="Account/Home" element={<AccountHomepage Content={<DisplayBudgetList SideBar={<DisplayBudgetsSidebar />} />} loginDisplay={<LoginDisplay />}></AccountHomepage>} ></Route>
                                <Route exact path="Account/CreateBudget" element={<AccountHomepage Sidebar={<DisplayBudgetsSidebar></DisplayBudgetsSidebar>} Content={<ManageBudget child={<CreateBudget />}></ManageBudget>} />} ></Route>
                                <Route exact path="Account/ManageBudget/CreateDebit" element={<AccountHomepage Sidebar={<DisplayBudgetsSidebar></DisplayBudgetsSidebar>} Content={<ManageBudget child={<CreateDebit />}></ManageBudget>} />} loginDisplay={<LoginDisplay />}></Route>
                                <Route exact path="Account/Budget/Display" element={<AccountHomepage Content={<BudgetDisplay Sidebar={<BudgetSidebar />} />} />} loginDisplay={<LoginDisplay />}></Route>
                                <Route exact path="Account/Display/Budget/:budget_id" element={<AccountHomepage Content={<BudgetDisplay Sidebar={BudgetSidebar} />} loginDisplay={<LoginDisplay />} />} ></Route>
                                <Route exact path="Account/Display/DirectDebits/:budget_id" element={<AccountHomepage Content={<DirectDebitDisplay Sidebar={BudgetSidebar} />} loginDisplay={<LoginDisplay />} />} ></Route>
                                <Route exact path="*" element={<NotFound />}></Route>
                            </> :
                            <>
                                <Route exact path="/" element={<FirstPage child={<Login />} />}></Route>
                                <Route exact path="/Register" element={<FirstPage child={<Register />} />}></Route>
                                <Route exact path="*" element={<NotFound />}></Route>
                                <Route exact path="Account/Home" element={<NotAuthorised />}></Route>
                                <Route exact path="Account/CreateBudget" element={<NotAuthorised />} ></Route>
                                <Route exact path="Account/ManageBudget/CreateDebit" element={<NotAuthorised />}></Route>
                                <Route exact path="Account/Budget/Display" element={<NotAuthorised />}></Route>
                                <Route exact path="Account/Display/Budget/:budget_id" element={<NotAuthorised />} ></Route>
                                <Route exact path="Account/Display/DirectDebits/:budget_id" element={<NotAuthorised />}></Route>
                            </>}
                    </Routes>
                </Router>
            );

        }

    }
}

