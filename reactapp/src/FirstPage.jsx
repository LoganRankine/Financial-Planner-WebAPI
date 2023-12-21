import React, { Component, useState } from 'react';
import './css/Account.css';
import { CookiesProvider, useCookies } from "react-cookie";
import {Link } from "react-router-dom";


function FirstPage({child }) {
    //let contents = this.state.loading
    //    ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
    //    : App.renderForecastsTable(this.state.forecasts);

    return (

        <div className="flex-loginContainer">
            <div className="flex-loginChild">
                <div className="login-header">
                    {/*Top of dialog*/}
                    <div className="header-container-top">
                        <span id="login-loginLogo" className="material-symbols-outlined">
                            account_balance
                        </span>
                    </div>
                    <div className="header-container-top">
                        <a id="header-title">Financial Planner</a>
                    </div>
                    <div className="header-container-bottom">
                        <Link className="UserOption" to="/">Sign In</Link>
                        <br></br>
                        <Link className="UserOption" to="/Register">Register</Link>
                    </div>
                    {/*Top of dialog*/}
                </div>
                {child }
                {/*<h1 id="tabelLabel" >Weather forecast</h1>*/}
                {/*<p>This component demonstrates fetching data from the server.</p>*/}
                {/*{contents}*/}
            </div>
        </div>
    );
}

export default FirstPage
