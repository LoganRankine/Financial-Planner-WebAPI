import React, { Children, Component, useState, useEffect } from 'react';
import '../css/PageNotFound.css'
import { CookiesProvider, useCookies } from "react-cookie";

function PageNotFound({ SideBar }) {

    useEffect(() => {
    }, []);


    return (
        <div className="page-not-found">
            <div className="not-found-container">
                <div className="not-found-container-header">
                    NOT AUTHORISED TO VIEW
                </div>
                <p>Are you signed in? Have you tried to open a page in a new tab? Unfortunately you can not do this.
                    Close this tab, and click the link on the previous tab</p>
                <a href="/" className="button-return">Sign In</a>
            </div>
        </div>
    );
}

export default PageNotFound