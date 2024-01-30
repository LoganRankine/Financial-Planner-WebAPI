import '../Account';
import React, { Component, useState } from 'react';
import { CookiesProvider, useCookies } from "react-cookie";
import FirstPage from '../FirstPage'
import { Link } from "react-router-dom";
import serverConfig from "../../server-config.json"

import { Button, Col, Form, InputGroup, Row, Container, Spinner, Modal, Toast, ToastContainer } from 'react-bootstrap';

function Register() {
    //User form variables
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [notification, setNotification] = useState("");

    //Show Modal
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)
        window.location.reload()
    };

    //Show toast
    const [showError, setShowError] = useState(true);
    const toggleShowError = () => setShowError(!showError);

    //Validation
    const [validated, setValidated] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);

    const match = (p_password, p_confirm) => {
        if (p_password === p_confirm) {
            return true;
            setPasswordMatch(true)
        }
        return false
    }

    const [loading, setLoading] = useState(false);

    const registerUser = () => {
        const createUser = {
            Email: email,
            Name: username,
            Password: password,
            Confirm_Password: confirmPassword,
        }

        console.log("Add inputs to JSON object", createUser)

        //Create user using API
        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/User/CreateUser`,
            { method: 'POST', body: JSON.stringify(createUser), mode: 'cors' }
        ).then(response => {
            //User created
            if (response.status == 201) {
                //Go to sign in page
                window.location.href = "/"
            }

            //Error occured
            if (response.status == 400) {
                response.json().then((data) => {
                    //Display the error to user
                    setNotification(data.ErrorDescription)
                    setShow(true)
                    setLoading(false)
                    setValidated(false)
                })
            }
        })
    }


    //Submit form
    const handleCreation = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (form.checkValidity() === true) {
            setLoading(true)
            event.preventDefault();
            event.stopPropagation();

            registerUser()
        }

        setValidated(true);
    };


    return (
        <>
            <Form style={{ display: 'contents' }} noValidate validated={validated} onSubmit={handleCreation}>
                <Row className="mb-3">
                    <Form.Group as={Col} >
                        <Form.Label>Username</Form.Label>
                        <InputGroup hasValidation >
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
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} >
                        <Form.Label>Email address</Form.Label>
                        <InputGroup hasValidation >
                            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                            <Form.Control
                                type="email"
                                placeholder="brianna@demo.com"
                                onChange={(e) => setEmail(e.target.value)}
                                required />
                            <Form.Control.Feedback type="invalid">
                                Please input your email.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} >
                        <Form.Label>Password</Form.Label>
                        <InputGroup hasValidation >
                            <Form.Control
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!match(password, confirmPassword)}
                                required />
                            <Form.Control.Feedback type="invalid">
                                {passwordMatch ? 'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters' : 'Passwords do not match'}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} >
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                isInvalid={!match(password, confirmPassword)}
                                required />
                            <Form.Control.Feedback type="invalid">
                                {passwordMatch ? 'Please input a password' : 'Passwords do not match'}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Form.Check
                            required
                            label="Agree to terms and conditions"
                            feedback="You must agree before submitting."
                            feedbackType="invalid"
                        />
                        <button className="signin" type="submit">
                            {loading ? <>
                                <Spinner animation="border" variant="info" role="status" size="sm" />
                                <span>Creating account</span>
                            </> : 'Register'}
                        </button>
                    </Form.Group>
                </Row>
            </Form>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Error creating account</Modal.Title>
                </Modal.Header>
                <Modal.Body>{notification}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Try again
                    </Button>
                </Modal.Footer>
            </Modal>

            <Toast show={showError} onClose={toggleShowError}>
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                </Toast.Header>
                <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
            </Toast>
        </>
    );
}

export default Register;