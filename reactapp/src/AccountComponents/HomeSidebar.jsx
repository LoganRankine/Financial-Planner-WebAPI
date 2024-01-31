import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import { CookiesProvider, useCookies } from "react-cookie";
import '../css/AccountHomepage.css'
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import CreateBudget from '../ManageBudgetComponents/CreateBudget'
import CreateDebit from '../ManageDebitComponents/CreateDebit'


import DisplayBudgetList from '../ManageBudgetComponents/DisplayBudgetList'



function DisplayBudgetsSidebar() {
    const [show, setShow] = useState(false);
    const [showDebit, setDebit] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div className="sidebar">
            <Modal show={show} onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Your Budget</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateBudget></CreateBudget>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="button">
                {/*<Link className="navbar-item middle-item" to="/Account/CreateBudget">*/}
                {/*    <span id="icon" class="material-symbols-outlined">add</span>*/}
                {/*    <a id="nav-title">New Budget</a>*/}
                {/*    <Link id="nav-title" to="/Account/CreateBudget">New Budget</Link>*/}
                {/*</Link>*/}
                <div className="navbar-item middle-item" onClick={handleShow}>
                    <span id="icon" className="material-symbols-outlined">add</span>
                    <div id="nav-title">New Budget</div>
                    {/*    <Link id="nav-title" to="/Account/CreateBudget">New Budget</Link>*/}
                </div>

                <Link className="navbar-item" to="/Account/Home">
                    <span id="icon" className="material-symbols-outlined">menu_book</span>
                    <a id="nav-title">Budgets</a>
                {/*    <Link id="nav-title" to="/Account/Home">Budgets</Link>*/}
                </Link>

            </div>
            <div className="account-settings" >
                <div id="bottom-navbar" className="navbar-item">
                    <span id="icon" className="material-symbols-outlined">settings</span>
                    <a id="nav-title">Account Settings</a>
                </div>
            </div>
        </div>
    );
}

export default DisplayBudgetsSidebar