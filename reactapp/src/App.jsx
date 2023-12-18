import React, { Component, useState } from 'react';
import './css/App.css';
import { CookiesProvider, useCookies } from "react-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FirstPage from './FirstPage'
import Login from './UserAuthentificationComponents/LogInForm'
import Register from './UserAuthentificationComponents/RegisterForm'
import manageBudget from './ManageBudgetComponents/ManageBudget'
import CreateBudget from './ManageBudgetComponents/CreateBudget'
import CreateDebit from './ManageBudgetComponents/CreateDebit'
import ManageBudget from './ManageBudgetComponents/ManageBudget';
import AccountHomepage from './AccountComponents/AccountHomepage';
import DisplayBudgetList from './ManageBudgetComponents/DisplayBudgetList'
import DisplayBudgetsSidebar from './AccountComponents/HomeSidebar'
import BudgetSidebar from './AccountComponents/BudgetSidebar'
import BudgetDisplay from './ManageBudgetComponents/BudgetDisplay'


export default class App extends Component {
    static displayName = App.name;
    constructor(props) {
        super(props);
        this.state = { forecasts: [], loading: true, isLogin: true };
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    static renderForecastsTable(forecasts) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    
    render() {
        //let contents = this.state.loading
        //    ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        //    : App.renderForecastsTable(this.state.forecasts);
        const authenticate = async () => {
            if (document.cookie == '') {
                return false
                console.log("Cookie not found")
            }
            else {
                let sessionID = document.cookie.replace("SessionID=", "")
                let checkAuthStatus = await fetch(`https://localhost:7073/api/User/CheckAuthStatus?SessionId=${sessionID}`,
                    {
                        method: 'GET',
                        mode: 'cors',
                    }
                )
                if (checkAuthStatus.ok) {
                    return true;
                }

                return false;
            }
        }

        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={<FirstPage child={<Login />} />}>
                    </Route>
                    <Route exact path="/Register" element={<FirstPage child={<Register />} />}>
                    </Route>
                    <Route exact path="Account/Home" element={<AccountHomepage Sidebar={<DisplayBudgetsSidebar />} Content={<DisplayBudgetList />}></AccountHomepage>} ></Route>
                    <Route exact path="Account/CreateBudget" element={<AccountHomepage Sidebar={<DisplayBudgetsSidebar />} Content={<ManageBudget child={<CreateBudget />}></ManageBudget>} />} ></Route>
                    <Route exact path="Account/ManageBudget/CreateDebit" element={<AccountHomepage Sidebar={<DisplayBudgetsSidebar />} Content={<ManageBudget child={<CreateDebit />}></ManageBudget>} />} ></Route>
                    <Route exact path="Account/Budget/Display" element={<AccountHomepage Sidebar={<BudgetSidebar />} Content={<BudgetDisplay/>} />} ></Route>
                </Routes>
            </Router>
        );
    }

    Login() {
        const [cookies, setCookie] = useCookies();
        const [name, setName] = useState("");
        const [password, setPassword] = useState("");

        const authenticateRequest = async (event) => {
            const user = {
                Name: name,
                Password: password,
            }
            console.log("Add inputs to JSON object", user)

            //Send data to create user
            let createUserRequest = await fetch("https://localhost:7073/api/User/AuthenticateUser",
                { method: 'POST', body: JSON.stringify(user), mode: 'cors' }
            )

            let response = await createUserRequest.json();

            if (createUserRequest.ok) {
                setCookie("SessionID", JSON.parse(response).SessionID, { path: "/" })
                window.location.href = "/Account"
            }

            console.log(response);
        };

        return (
            <div class="content">
                <div class="input-container">
                    <label>Username</label><br />
                    <input type="text" value={name}
                        onChange={(e) => setName(e.target.value)}
                        class="input-box" />
                </div>
                <div class="input-container">
                    <label>Password</label><br />
                    <input type="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        class="input-box" />
                </div>
                <div class="input-container">
                    <button onClick={authenticateRequest} class="signIn">Sign In</button>
                </div>
            </div>
        );
    }

    async isAuthenticated() {
    

    }


    Register() {
        const [username, setUsername] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");

        const createRequest = async (event) =>
        {
            const createUser = {
                Email: email,
                Name: username,
                Password: password,
                Confirm_Password: confirmPassword,
            }
            console.log("Add inputs to JSON object", createUser)

            //Send data to create user
            let createUserRequest = await fetch("https://localhost:7073/api/User/CreateUser",
                { method: 'POST', body: JSON.stringify(createUser), mode: 'cors' }
            )

            let response = await createUserRequest.json();

            if (createUserRequest.ok) {
                setCookie("SessionID", JSON.parse(response).SessionID, { path: "/" })
                window.location.href = "/"
            }

            console.log(response);


        };

        return (
            <div class="content">
                <div class="input-container">
                    <label>Username</label><br />
                    <input type="text" value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        class="input-box" />
                </div>
                <div class="input-container">
                    <label>Email</label><br />
                    <input type="text" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        class="input-box" />
                </div>
                <div class="input-container">
                    <label>Password</label><br />
                    <input type="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        class="input-box" />
                </div>
                <div class="input-container">
                    <label>Confirm Password</label><br />
                    <input type="password" value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        class="input-box" />
                </div>
                <div class="input-container">
                    <button onClick={createRequest} class="signIn">Register</button>
                </div>
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        this.setState({ forecasts: data, loading: false });
    }
}

