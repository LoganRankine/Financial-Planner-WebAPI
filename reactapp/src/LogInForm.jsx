import './Account.css';
import React, { Component, useState } from 'react';
import { CookiesProvider, useCookies } from "react-cookie";
import FirstPage from './FirstPage';
import { Link } from "react-router-dom";



function login() {
    const [cookies, setCookie] = useCookies();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const authenticaterequest = async (event) => {
        const user = {
            Name: name,
            Password: password,
        }
        console.log("add inputs to json object", user)

        //send data to create user
        let createuserrequest = await fetch("https://localhost:7073/api/user/authenticateuser",
            { method: 'post', body: JSON.stringify(user), mode: 'cors' }
        )

        let response = await createuserrequest.json();

        if (createuserrequest.ok) {
            setCookie("SessionID", JSON.parse(response).SessionID, { path: "/" })
            window.location.href = "/Account/CreateBudget"
        }

        console.log(response);
    };

    return (
        <div class="content">
            <div class="input-container">
                <label>username</label><br />
                <input type="text" value={name}
                    onChange={(e) => setName(e.target.value)}
                    class="input-box" />
            </div>
            <div class="input-container">
                <label>password</label><br />
                <input type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    class="input-box" />
            </div>
            <div class="input-container">
                <button onClick={authenticaterequest} class="signin">sign in</button>
            </div>
        </div>
    );
}

export default login;