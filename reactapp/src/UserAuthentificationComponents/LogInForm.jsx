import '../css/Account.css';
import React, { Component, useState, useEffect } from 'react';
import { CookiesProvider, useCookies } from "react-cookie";
import FirstPage from '../FirstPage';
import { Link } from "react-router-dom";
import serverConfig from "../../server-config.json"

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

function login() {
    const [cookies, setCookie] = useCookies();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (form.checkValidity() === true) {
            setLoading(true)
            event.preventDefault();
            event.stopPropagation();

            console.log("validated")
            const user = {
                Name: name,
                Password: password,
            }
            console.log("add inputs to json object", user)

            //send data to create user
            fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/user/authenticateuser`,
                { method: 'post', body: JSON.stringify(user), mode: 'cors' }
            ).then(response => response.json().then(data => {
                console.log(response)
                console.log(data)
                if (response.ok) {
                    console.log(response)
                    setCookie("SessionID", data.SessionID, { path: "/" })
                    window.location.href = "/Account/Home"
                    setValidated(true);

                }
                else {
                    console.log(data)
                    setError(true);
                    setValidated(false);
                }
            }))
        }

        setValidated(true);
    };

    const authenticaterequest = async (event) => {
        const user = {
            Name: name,
            Password: password,
        }
        console.log("add inputs to json object", user)

        //send data to create user
        let createuserrequest = await fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/user/authenticateuser`,
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
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="content">
            {error ? <p className="errorbx" >Username or password incorrect</p> : ""}
            <Row className="input-container">
                <Form.Group as={Col} controlId="validationCustomUsername">
                    <label>Username</label>
                    <InputGroup hasValidation className="input-box">
                        <Form.Control
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Username"
                            aria-describedby="inputGroupPrepend"
                            required
                        />
                    </InputGroup>
                </Form.Group>
            </Row>
            <Row className="input-container" >
                <Form.Group as={Col} controlId="validationCustomUsername">
                    <Form.Label>Password</Form.Label>
                    <InputGroup hasValidation className="input-box">
                        <Form.Control
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            aria-describedby="inputGroupPrepend"
                            required
                            style={{marginBottom : '10px'} }
                        />
                    </InputGroup>
                </Form.Group>
            </Row>
            <button className="signin" type="submit">
                {loading ? <>
                    <Spinner animation="border" variant="info" role="status" size="sm" />
                    <span>Signing in</span>
                </> : 'Sign In'}
            </button>
        </Form>

    );
}

export default login;