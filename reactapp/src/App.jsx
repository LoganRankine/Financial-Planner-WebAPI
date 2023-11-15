import React, { Component } from 'react';
import './index.css';

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = { forecasts: [], loading: true };
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

        const isLogin = true;

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
                        <div class="header-container-bottom">
                            <a onclick={this.isLogin == false}>Sign In</a>
                            <br></br>
                            <a>Register</a>
                        </div>
                        {/*Top of dialog*/}
                    </div>
                    {
                        (() => {
                            if (isLogin) {
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
        return (
            <div class="content">
            LOGIN PLEASE
            </div>
        );
    }

    Register() {
        return (
            <div class="content">
                REGISTER PLEASE
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        this.setState({ forecasts: data, loading: false });
    }
}

