import React, { Children, Component, useState, useEffect } from 'react';
import '../css/PageNotFound.css'
import { CookiesProvider, useCookies } from "react-cookie";
import Spinner from 'react-bootstrap/Spinner';

function PageNotFound({ SideBar }) {

    useEffect(() => {
    }, []);


    return (
        <div className="centre-loading">
            {/*<span class="material-symbols-outlined">*/}
            {/*    account_balance*/}
            {/*</span>*/}
            <Spinner className="spinner-size" animation="border" variant="light" role="status" />
        </div>);
}

export default PageNotFound