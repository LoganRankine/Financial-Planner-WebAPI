import React, { Component, useState } from 'react';
import './Account';
import { CookiesProvider, useCookies } from "react-cookie";
import {Link } from "react-router-dom";


function FirstPage({child }) {
    //let contents = this.state.loading
    //    ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
    //    : App.renderForecastsTable(this.state.forecasts);

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
                        <Link class="UserOption" to="/">Sign In</Link>
                        <br></br>
                        <Link class="UserOption" to="/Register">Register</Link>
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
