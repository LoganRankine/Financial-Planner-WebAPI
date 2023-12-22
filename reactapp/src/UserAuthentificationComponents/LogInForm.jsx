import '../css/Account.css';
import React, { Component, useState } from 'react';
import { CookiesProvider, useCookies } from "react-cookie";
import FirstPage from '../FirstPage';
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
            console.log(response)
            setCookie("SessionID", response.SessionID, { path: "/" })
            window.location.href = "/Account/Home"
        }

        console.log(response);
    };

    return (
        <div className="content">
            <div className="input-container">
                <label>Username</label><br />
                <input type="text" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-box" />
            </div>
            <div className="input-container">
                <label>Password</label><br />
                <input type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-box" />
            </div>
            <div className="input-container">
                <button onClick={authenticaterequest} className="signin">Sign in</button>
            </div>
        </div>
    );
}

export default login;