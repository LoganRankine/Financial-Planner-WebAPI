import React, { Component, useState } from 'react';
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


export default class App extends Component {
    static displayName = App.name;
    constructor(props) {
        super(props);
        this.state = { forecasts: [], loading: true, isLogin: true };
    }
    
    render() {
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={<FirstPage child={<Login />} />}></Route>
                    <Route exact path="/Register" element={<FirstPage child={<Register />} />}></Route>
                    <Route exact path="Account/Home" element={<AccountHomepage Content={<DisplayBudgetList SideBar={<DisplayBudgetsSidebar />} />} loginDisplay={<LoginDisplay/>}></AccountHomepage>} ></Route>
                    <Route exact path="Account/CreateBudget" element={<AccountHomepage Content={<ManageBudget Sidebar={<DisplayBudgetsSidebar />} child={<CreateBudget />}></ManageBudget>} />} ></Route>
                    <Route exact path="Account/ManageBudget/CreateDebit" element={<AccountHomepage Content={<ManageBudget Sidebar={<DisplayBudgetsSidebar />} child={<CreateDebit />}></ManageBudget>} />} loginDisplay={<LoginDisplay />}></Route>
                    <Route exact path="Account/Budget/Display" element={<AccountHomepage Content={<BudgetDisplay Sidebar={<BudgetSidebar />} />} />} loginDisplay={<LoginDisplay />}></Route>
                    <Route exact path="Account/Display/Budget/:budget_id" element={<AccountHomepage Content={<BudgetDisplay Sidebar={BudgetSidebar} />} loginDisplay={<LoginDisplay />} />} ></Route>
                    <Route exact path="Account/Display/DirectDebits/:budget_id" element={<AccountHomepage Content={<DirectDebitDisplay Sidebar={BudgetSidebar} />} loginDisplay={<LoginDisplay />} />} ></Route>
                    <Route exact path="*" element={<NotFound/>}></Route>
                </Routes>
            </Router>
        );
    }
}

