import React, { Component, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";

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
        let contents = this.state.loading
            ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
            : App.renderForecastsTable(this.state.forecasts);

        return (

            <div class="flex-loginContainer">
                <div class="flex-loginChild">
                    <div class="login-header">
                        {/*Top of dialog*/}
                        <div class="header-container-top">
                            <span id="login-loginLogo" class="material-symbols-outlined">
                                account_balance
                            </span>
                        </div>
                        <div class="header-container-top">
                            <a id="header-title">Financial Planner</a>
                        </div>
                        <div class="header-container-bottom">
                            <a class="UserOption" onClick={() => { this.setState({ isLogin: true }) }}>Sign In</a>
                            <br></br>
                            <a class="UserOption" onClick={() => { this.setState({ isLogin: false }) }}>Register</a>
                        </div>
                        {/*Top of dialog*/}
                    </div>
                    {
                        (() => {
                            if (this.state.isLogin) {
                                return (
                                    <this.Login></this.Login>
                                )
                            } else {
                                return (
                                    <this.Register></this.Register>
                                )
                            }
                        })()
                    }
                    {/*<h1 id="tabelLabel" >Weather forecast</h1>*/}
                    {/*<p>This component demonstrates fetching data from the server.</p>*/}
                    {/*{contents}*/}
                </div>
            </div>
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

    AuthenticateUser() {
        console.log("hi")
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

