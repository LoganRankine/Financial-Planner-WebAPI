import '../Account';
import React, { Component, useState } from 'react';
import { CookiesProvider, useCookies } from "react-cookie";
import FirstPage from '../FirstPage'
import { Link } from "react-router-dom";
import serverConfig from "../../server-config.json"

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (form.checkValidity() === true) {
            event.preventDefault();
            event.stopPropagation();

            const createUser = {
                Email: email,
                Name: username,
                Password: password,
                Confirm_Password: confirmPassword,
            }
            console.log("Add inputs to JSON object", createUser)

            //Send data to create user
            fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/User/CreateUser`,
                { method: 'POST', body: JSON.stringify(createUser), mode: 'cors' }
            ).then(response => {
                if (response.status == 200) {
                    response.json().then((data) => {
                        setCookie("SessionID", JSON.parse(data).SessionID, { path: "/" })
                        window.location.href = "/"
                    })
                    console.log(response);
                }
            })
        }


        setValidated(true);
    };

    const createRequest = async (event) => {
        const createUser = {
            Email: email,
            Name: username,
            Password: password,
            Confirm_Password: confirmPassword,
        }
        console.log("Add inputs to JSON object", createUser)

        //Send data to create user
        let createUserRequest = await fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/User/CreateUser`,
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
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="content">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Username</Form.Label>
                <InputGroup hasValidation className="input-box">
                    <Form.Control
                        type="username"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="brianna"
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please input a username.
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email address</Form.Label>
                <InputGroup hasValidation className="input-box">
                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                    <Form.Control
                        type="email address"
                        placeholder="brianna@demo.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    <Form.Control.Feedback type="invalid">
                        Please input your email.
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Password</Form.Label>
                <InputGroup hasValidation className="input-box">
                    <Form.Control
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                    <Form.Control.Feedback type="invalid">
                        Please input a password.
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup hasValidation className="input-box">
                    <Form.Control
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required />
                    <Form.Control.Feedback type="invalid">
                        Please input a password.
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>
            <Form.Check
                required
                label="Agree to terms and conditions"
                feedback="You must agree before submitting."
                feedbackType="invalid"
            />
            <button className="signin" type="submit">Register</button>
        </Form>
    );
}

export default Register;