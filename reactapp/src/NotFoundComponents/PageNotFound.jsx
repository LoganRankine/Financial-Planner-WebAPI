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
                    Page not found
                </div>
                <p>The url you have requested can not be found. Check the url or go to the home page.</p>
                <a href="/" className="button-return">Go to Home</a>
            </div>
        </div>
    );
}

export default PageNotFound