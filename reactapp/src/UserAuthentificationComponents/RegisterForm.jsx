import '../Account';
import React, { Component, useState } from 'react';
import { CookiesProvider, useCookies } from "react-cookie";
import FirstPage from '../FirstPage'
import { Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const createRequest = async (event) => {
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
                <button onClick={createRequest} class="signin">Register</button>
            </div>
        </div>
    );
}

export default Register;